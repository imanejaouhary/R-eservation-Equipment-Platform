### kifach diro lpull fach tkono f lmain 
```bash
git checkout main
git pull origin main
```

### fach tkono baghin tkhdmo fchi branch dialkom darori diro pull lmain 
```bash
git checkout your-branch
git pull origin main
```
### kifach tcreer branch 
```bash
# مثال:
git checkout -b branch-namee
```

### drti chi modification fbranch dialk wbghiti tpushiha fih
```bash
# 1. كانجمع التغييرات كاملين
git add .

# 2. كانسجل الـ commit بميساج كيشرح شنو زدت
git commit -m "description dial dakchi li changiti bach n3rfo ach zdti wla n9Sti"

# 3. كانسيفط الـ branch ديالي لـ GitHub
git push -u origin your-branch
```
*(المرة الجاية من بعد أول push، يكفيك دير فقط `git push`)*

---


### kifach tpushi lkhdma dialk f lmain mn lbranch dialk
```bash
# 1. رجع للـ main
git checkout main

# 2. جيب آخر نسخة من السيرفر
git pull origin main

# 3. دخل التغييرات ديال البرانش ديالك
git merge your-branch

# 4. دفع الـ main الجديد لـ GitHub
git push origin main
```

---

## 👥 3. ila chi wa7d zad chi branch wbghiti tchofha 3andk f EDM dialk kadir had les cmd 

```bash
# 1. كتجيب التحديثات ديال كلشي les branches
git fetch origin

# 2. كتدخل للـ branch ديالو
git checkout branch-name-li-zad
```

---
---



### ❓ بغيت نمسح branch قديمة مابقاتش صالحة
```bash
# mn (Local):
git branch -D branch-name

# mn GitHub (Remote):
git push origin --delete branch-name

```

---

