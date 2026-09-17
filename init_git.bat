@echo off
cd /d "c:\Users\archi\Downloads\vyomforged2.0-main\vyomforged2.0-main"
"C:\Program Files\Git\cmd\git.exe" init
"C:\Program Files\Git\cmd\git.exe" config user.name "Archit Sharma"
"C:\Program Files\Git\cmd\git.exe" config user.email "archit.sharma04.cse@gmail.com"
"C:\Program Files\Git\cmd\git.exe" add .gitignore README.md backend/ frontend-fixed/
"C:\Program Files\Git\cmd\git.exe" commit -m "feat: HimAlert AI - Integrated Early Warning & Impact Prediction System for Himachal Pradesh"
"C:\Program Files\Git\cmd\git.exe" branch -M main
"C:\Program Files\Git\cmd\git.exe" log -1 --stat > C:\Users\archi\git_commit.log
echo Git initialized and committed successfully > C:\Users\archi\git_done.txt
