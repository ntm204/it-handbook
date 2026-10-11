# Lab 3 · Server đầy ổ

Tạo một ổ ảo 50 MB trong RAM (tmpfs) rồi làm đầy nó theo **cả hai kiểu**: hết dung lượng và hết inode. An toàn tuyệt đối với ổ thật.

> Tự tay gặp lỗi `No space left on device`; tìm ra file đã xoá nhưng vẫn chiếm chỗ; phân biệt hết dung lượng với hết inode.

<p class="related">Kiến thức: <a href="#/linux?id=o-day">Ổ đầy hai kiểu</a> · <a href="#/xu-ly-su-co?id=su-co-7">Xử lý: server đầy ổ</a></p>

## Chuẩn bị :id=chuan-bi

```bash
sudo mkdir -p /mnt/lab3
sudo mount -t tmpfs -o size=50M,nr_inodes=2000 tmpfs /mnt/lab3   # ổ 50 MB, tối đa 2000 file
sudo chown $USER /mnt/lab3
```

## Làm mẫu :id=lam-mau

### 1 · Làm đầy dung lượng :id=day-dung-luong

```bash
dd if=/dev/zero of=/mnt/lab3/app.log bs=1M count=60
df -h /mnt/lab3
```

```
dd: IO error: No space left on device
tmpfs            50M   50M     0 100% /mnt/lab3
```

### 2 · Xoá file đang bị giữ: dung lượng không về :id=file-bi-giu

Giả lập một chương trình đang ghi log (`tail -f` giữ file mở), rồi xoá file:

```bash
tail -f /mnt/lab3/app.log > /dev/null &
rm /mnt/lab3/app.log
df -h /mnt/lab3
sudo lsof +L1 | grep lab3
```

```
tmpfs            50M   50M     0 100% /mnt/lab3
tail  6049  …  52428800  …  /mnt/lab3/app.log (deleted)
```

File đã biến mất khỏi thư mục nhưng ổ **vẫn 100%**: tiến trình `tail` (PID 6049) còn giữ 50 MB. Dừng tiến trình đó:

```bash
kill %1
df -h /mnt/lab3
```

```
tmpfs            50M     0   50M   0% /mnt/lab3
```

### 3 · Cách đúng: làm rỗng thay vì xoá :id=truncate

```bash
dd if=/dev/zero of=/mnt/lab3/app.log bs=1M count=30 status=none
tail -f /mnt/lab3/app.log > /dev/null &
truncate -s 0 /mnt/lab3/app.log
df -h /mnt/lab3
kill %1
```

```
tmpfs            50M     0   50M   0% /mnt/lab3
```

Dung lượng trả về **ngay**, không cần dừng chương trình đang ghi.

### 4 · Hết inode khi ổ còn trống :id=het-inode

```bash
rm -f /mnt/lab3/app.log
for i in $(seq 1 2100); do touch /mnt/lab3/f$i || break; done
df -h /mnt/lab3
df -i /mnt/lab3
```

```
touch: cannot touch '/mnt/lab3/f2000': No space left on device
tmpfs            50M     0   50M   0% /mnt/lab3      ← còn trống 50M
tmpfs           2000  2000     0  100% /mnt/lab3     ← hết inode
```

Cùng một thông báo lỗi nhưng `df -h` lại báo trống: chỉ `df -i` mới chỉ ra nguyên nhân.

## Tự làm :id=tu-lam

Tạo lại tình huống ở bước 2 với 3 tiến trình `tail -f` cùng giữ một file đã xoá. Viết **một lệnh** liệt kê PID của tất cả các tiến trình đang giữ file đã xoá trong `/mnt/lab3`.

<details>
<summary>Đáp án</summary>

```bash
sudo lsof +L1 | grep /mnt/lab3 | awk '{print $2}' | sort -u
```

Cột thứ 2 của `lsof` là PID. Cũng có thể dùng `sudo lsof -t +L1 /mnt/lab3` (`-t` chỉ in PID).

</details>

## Dọn dẹp :id=don-dep

```bash
kill %1 %2 %3 2>/dev/null
sudo umount /mnt/lab3 && sudo rmdir /mnt/lab3
```

## Cần nhớ :id=can-nho

1. Đã xoá mà ổ không trống: `sudo lsof +L1`, rồi dừng hoặc restart tiến trình đang giữ file.
2. Log đang được ghi: làm rỗng bằng `truncate -s 0`, đừng `rm`.
3. Báo đầy mà `df -h` còn trống: kiểm tra `df -i`.

## Nguồn tham khảo :id=nguon

- [lsof(8)](https://manpages.ubuntu.com/manpages/noble/en/man8/lsof.8.html) · [tmpfs(5)](https://manpages.ubuntu.com/manpages/noble/en/man5/tmpfs.5.html)
