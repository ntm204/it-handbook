# This Mac

[Tiếng Việt](may-mac.md) · **English**

Commands actually used to set up and run this Mac, grouped by task. Machine configuration lives in the `dotfiles` repo.
Replace `<...>` with your own value.

---

## 1. Know your machine

| Task | Command |
|---|---|
| macOS version | `sw_vers` |
| Model, chip, RAM | `system_profiler SPHardwareDataType` |
| Battery: capacity, cycles | `system_profiler SPPowerDataType \| grep -E "Cycle\|Condition\|Capacity"` |
| Disk space | `df -h /` |
| Biggest folders | `du -sh ~/* \| sort -rh \| head` |
| CPU architecture | `uname -m` |

## 2. Files & folders

| Task | Command |
|---|---|
| List including hidden files | `ll` (= `ls -la`) |
| Folder tree | `lt` |
| Find files by name | `fd <name>` |
| Search text in code | `rg "<text>"` · `rgf <text>` (opens in VS Code) |
| View a file with colours | `cat <file>` (aliased to `bat`) |
| Move to Trash | `trash <file>` (safer than `rm`) |
| Create a link · see where it points | `ln -s <source> <target>` · `readlink <target>` |
| Make a file executable | `chmod +x <file>` |
| Open in Finder · VS Code | `open .` · `code .` |

## 3. Processes & ports

| Task | Command |
|---|---|
| What is using a port | `port 3000` (= `lsof -nP -iTCP:3000 -sTCP:LISTEN`) |
| Find a process by name | `pgrep -fl <name>` |
| Stop a process | `kill <PID>` · stubborn: `kill -9 <PID>` |
| CPU and RAM | `btop` |
| Restart Dock / Finder | `killall Dock` · `killall Finder` |

## 4. Networking

| Task | Command |
|---|---|
| Local IP address | `ipconfig getifaddr en0` |
| Check connectivity | `ping -c 4 google.com` |
| Route to a host | `mtr google.com` (needs `sudo`) · `traceroute google.com` |
| DNS lookup | `dig google.com` · `dig +short google.com` |
| Is a port open | `nc -zv <host> <port>` |
| HTTP headers | `curl -I https://example.com` |
| Status code only | `curl -s -o /dev/null -w "%{http_code}\n" <url>` |
| Port scan | `nmap <host>` |

## 5. macOS settings from the terminal

| Task | Command |
|---|---|
| Read a setting | `defaults read com.apple.dock autohide` |
| Change a setting | `defaults write com.apple.dock autohide -bool true && killall Dock` |
| Low Power Mode on battery | `sudo pmset -b lowpowermode 1` |
| Power settings | `pmset -g` |
| Open a System Settings pane | `open "x-apple.systempreferences:com.apple.Battery-Settings.extension"` |
| Re-apply all settings | `./macos/defaults.sh` |

## 6. Installing & removing software

| Task | Command |
|---|---|
| Search · info | `brew search <name>` · `brew info <name>` |
| Install from the list | `brew bundle` (in the dotfiles folder) |
| Check the machine matches the list | `brew bundle check --verbose` |
| What's outdated · update | `brew outdated` · `brew upgrade` |
| Who depends on a package | `brew uses --installed <name>` |
| **Full inventory** | `mac audit` |
| **Safe uninstall** | `mac rm <name>` |
| **Clean up** | `mac clean` |
| VS Code extensions | `code --list-extensions` · `code --install-extension <id>` |

## 7. Languages (mise)

| Task | Command |
|---|---|
| Versions in use | `mise ls` |
| Add a language machine-wide | `mise use -g go` |
| Pin a version for one project | `mise use node@22` (inside the project) |
| Update | `mise upgrade` |

## 8. Git & GitHub

| Task | Command |
|---|---|
| Status · log | `gs` · `gl` |
| Save changes | `git add -A && git commit -m "<message>" && git push` |
| Get latest code | `git pull` |
| Switch branch | `gb` (pick from a menu) |
| Git UI | `lg` |
| Undo a pushed commit (safe) | `git revert <commit>` |
| Drop last commit, keep changes | `git undo` |
| GitHub login · check | `gh auth login` · `gh auth status` |
| Private repo from current folder | `gh repo create <name> --private --source=. --push` |
| Clone · list repos | `gh repo clone <user>/<repo>` · `gh repo list` |

## 9. Docker & Linux machine

| Task | Command |
|---|---|
| Start · stop project services | `docker compose up -d` · `docker compose down` |
| Status · logs | `docker compose ps` · `docker compose logs -f <service>` |
| Shell into a container | `docker compose exec <service> sh` |
| Docker disk usage | `docker system df` |
| Learning databases | `db up -d` · `db down` · `db ps` |
| Connect to Postgres · Redis | `psql postgres://dev:dev@localhost:15432/dev` · `redis-cli -p 16379 ping` |
| Linux machine: enter · list | `orb -m lab` · `orb list` |
| Run one command in Linux | `orb -m lab <command>` |

## 10. Running a project (chatty as example)

```sh
npm ci                                   # install exact versions from package-lock (first time)
cp .env.example apps/server/.env         # create the env file (first time)
docker compose up -d postgres mailpit    # start the database
npm run dev:server                       # terminal 1
npm run dev:web                          # terminal 2 (Cmd+D to split)
```

Quick HTML: `open index.html` · with live reload: `npx vite --open`.

## 11. Shell

| Task | Command |
|---|---|
| Reload shell config | `reload` |
| Where a command lives | `command -v <command>` |
| Show PATH | `echo $PATH \| tr ':' '\n'` |
| Search history | `Ctrl+R` |
| Re-run last command with sudo | `sudo !!` |
| Examples for a command | `tldr <command>` · full manual: `man <command>` |
