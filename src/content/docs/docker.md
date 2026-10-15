---
title: Docker
description: Bảng lệnh Docker và Docker Compose hay dùng nhất — chạy, xem log, vào container, dọn dung lượng, sửa lỗi container không chạy.
man: docker(1)
order: 6
summary: "container, image, Compose, dọn dung lượng"
---

Lệnh Docker và Docker Compose dùng hằng ngày.

## Gặp vấn đề {#gap-van-de}

| Triệu chứng | Chạy trước |
|---|---|
| Container chạy rồi tắt ngay | `docker ps -a` → `docker logs <tên>` |
| Container cứ khởi động lại | `docker inspect <tên> --format '{{.State.ExitCode}} {{.State.Error}}'` |
| `port is already allocated` | Cổng đã có tiến trình khác dùng: `docker ps` · `sudo ss -tulpn \| grep :<cổng>` |
| Không vào được dịch vụ trong container | `docker port <tên>`, nhớ ứng dụng phải nghe ở `0.0.0.0`, không phải `127.0.0.1` |
| Hết ổ đĩa | `docker system df` → `docker system prune` |
| Sửa code / Dockerfile mà không thấy đổi | `docker compose up -d --build` |
| Container không gọi được container khác | Dùng **tên service** làm địa chỉ, ví dụ `postgres:5432`, không dùng `localhost` |

## Container {#container}

| Việc | Lệnh |
|---|---|
| Đang chạy · tất cả | `docker ps` · `docker ps -a` |
| Chạy nền, mở cổng, đặt tên | `docker run -d --name web -p 8080:80 nginx` |
| Chạy thử rồi tự xoá | `docker run --rm -it ubuntu bash` |
| Dừng · bật · xoá | `docker stop <tên>` · `docker start <tên>` · `docker rm <tên>` |
| Log, theo dõi trực tiếp | `docker logs -f --tail 100 <tên>` |
| Vào trong container | `docker exec -it <tên> sh` |
| CPU, RAM từng container | `docker stats` |
| Chép file ra / vào | `docker cp <tên>:/đường/dẫn ./` · `docker cp ./file <tên>:/tmp/` |
| Xem chi tiết (IP, ổ gắn, biến môi trường) | `docker inspect <tên>` |

## Image {#image}

| Việc | Lệnh |
|---|---|
| Danh sách | `docker images` |
| Tải về | `docker pull <image>:<tag>` |
| Build từ Dockerfile | `docker build -t <tên>:<tag> .` |
| Xoá | `docker rmi <image>` |

## Compose {#compose}

Chạy trong thư mục có `compose.yml`.

| Việc | Lệnh |
|---|---|
| Bật nền · build lại rồi bật | `docker compose up -d` · `docker compose up -d --build` |
| Tắt (giữ dữ liệu) · tắt và xoá dữ liệu | `docker compose down` · `docker compose down -v` |
| Trạng thái | `docker compose ps` |
| Log một service | `docker compose logs -f <service>` |
| Vào một service | `docker compose exec <service> sh` |
| Khởi động lại một service | `docker compose restart <service>` |
| Kiểm tra file compose | `docker compose config` |

> **Chú ý:** `docker compose down -v` xoá luôn **volume**: dữ liệu database trong đó mất hẳn.

## Dọn dung lượng {#don-dep}

| Việc | Lệnh |
|---|---|
| Docker đang chiếm bao nhiêu | `docker system df` |
| Dọn container đã dừng, image thừa, cache build | `docker system prune` |
| Dọn cả image không dùng | `docker system prune -a` |
| Dọn volume không dùng | `docker volume prune` |

## Nguồn {#nguon}

- Docker Docs — [Docker CLI reference](https://docs.docker.com/reference/cli/docker/) · [Docker Compose CLI](https://docs.docker.com/reference/cli/docker/compose/) · [Networking in Compose](https://docs.docker.com/compose/how-tos/networking/)
