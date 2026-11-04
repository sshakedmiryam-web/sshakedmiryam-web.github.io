window.CODE_PROJECTS = [
  {
    "id": "cart-state",
    "title": "סל אחד. מצב משותף.",
    "description": "עדכון סל הקניות עם Jotai: זיהוי מוצר שכבר נוסף והגדלת הכמות, תוך שמירה על מצב משותף בין עמודים.",
    "language": "JavaScript · React / Jotai",
    "file": "products/page.js",
    "image": "code-shop.webp",
    "caption": "רכיב הסל המקורי, עם שני מוצרים לדוגמה מהקטלוג.",
    "code": "const setCartItems = useSetAtom(cartAtom);\n\n    const handleAddToCart = (product) => {\n        setCartItems((prevItems) => {\n            const existingItem = prevItems.find((item) => item.id === product.id);\n\n            if (existingItem) {\n                return prevItems.map((item) =>\n                    item.id === product.id\n                        ? { ...item, quantity: (item.quantity || 1) + 1 }\n                        : item\n                );\n            }\n\n            return [...prevItems, { ...product, quantity: 1 }];\n        });\n    }",
    "download": "code/cart-state.js"
  },
  {
    "id": "calculator",
    "title": "כל לחיצה מקבלת משמעות.",
    "description": "מחשבון: טיפול באירועי לחיצה, מחיקת תו, איפוס, חישוב התוצאה והצגת שגיאה. דוגמה ללוגיקה שמחברת כפתורים ותצוגה.",
    "language": "JavaScript · Events / Calculator",
    "file": "calcolator/main.js",
    "image": "code-calculator.webp",
    "caption": "המחשבון המקורי לאחר הזנת התרגיל 7 × 8.",
    "code": "function onKeyPressed(event) {\n    const screen = document.getElementById('screen');\n    const value = event.target.innerText;\n\n    if (value === 'AC') {\n        screen.value = '';\n    } else if (value === 'DEL') {\n        screen.value = screen.value.slice(0, -1);\n    } else if (value === '=') {\n        try {\n            screen.value = eval(screen.value);\n        } catch (e) {\n            screen.value = 'Error';\n        }\n    }\n    else if (screen.value === '0') {\n        screen.value = value;\n    } else {\n        screen.value += value;\n    }\n}\n\n\ndocument.addEventListener(\"DOMContentLoaded\", () => {\n    const buttons = [...document.getElementsByTagName('button')];\n\n    for (let button of buttons) {\n        button.addEventListener('click', onKeyPressed);\n    }\n});",
    "download": "code/calculator.js"
  },
  {
    "id": "tasks",
    "title": "מהמשימה אל הפעולה.",
    "description": "יצירת רכיבי ממשק מתוך מצב המשימות, סימון השלמה, מחיקה ושמירה בדפדפן. אותה רשימה ממשיכה איתך גם אחרי רענון.",
    "language": "JavaScript · DOM / LocalStorage",
    "file": "ToDoList/main.js",
    "image": "code-todo.webp",
    "caption": "יישום המשימות המקורי עם משימות לדוגמה.",
    "code": "const taskInput = document.getElementById(\"taskInput\");\nconst addBtn = document.getElementById(\"addBtn\");\nconst taskList = document.getElementById(\"taskList\");\n\n// טעינה מ-LocalStorage\nlet tasks = JSON.parse(localStorage.getItem(\"tasks\")) || [];\n\nfunction saveTasks() {\n    localStorage.setItem(\"tasks\", JSON.stringify(tasks));\n}\n\nfunction renderTasks() {\n    taskList.innerHTML = \"\";\n\n    tasks.forEach((task, index) => {\n\n        const li = document.createElement(\"li\");\n        li.className = \"list-group-item d-flex justify-content-between align-items-center\";\n\n        const text = document.createElement(\"span\");\n        text.innerText = task.text;\n\n        if (task.done) {\n            text.classList.add(\"task-done\");\n        }\n\n        // סימון הושלם\n        text.addEventListener(\"click\", () => {\n            tasks[index].done = !tasks[index].done;\n            saveTasks();\n            renderTasks();\n        });\n\n        const btns = document.createElement(\"div\");\n\n        // כפתור וי\n        const doneBtn = document.createElement(\"button\");\n        doneBtn.className = \"btn btn-success btn-sm ms-2\";\n        doneBtn.innerHTML = `<i class=\"bi bi-check-lg\"></i>`;\n\n        doneBtn.addEventListener(\"click\", () => {\n            tasks[index].done = !tasks[index].done;\n            saveTasks();\n            renderTasks();\n        });\n\n        // כפתור מחיקה\n        const deleteBtn = document.createElement(\"button\");\n        deleteBtn.className = \"btn btn-danger btn-sm\";\n        deleteBtn.innerHTML = `<i class=\"bi bi-trash\"></i>`;\n\n        deleteBtn.addEventListener(\"click\", () => {\n            tasks.splice(index, 1);\n            saveTasks();\n            renderTasks();\n        });\n\n        btns.appendChild(doneBtn);\n        btns.appendChild(deleteBtn);\n\n        li.appendChild(text);\n        li.appendChild(btns);\n\n        taskList.appendChild(li);\n    });\n}",
    "download": "code/tasks.js"
  },
  {
    "id": "identity",
    "title": "מערכת אחת. הרבה גדלים.",
    "description": "רשת עבודות גמישה שמסתדרת לפי רוחב המסך, ותצוגת תמונה מוגדלת שמאפשרת להתמקד בפרטי המיתוג.",
    "language": "CSS · Responsive layout",
    "file": "websit/style.css",
    "image": "code-identity.webp",
    "caption": "אזור העבודות באתר Visual Identity Kit המקורי.",
    "code": ".portfolio {\n    display: grid;\n    grid-template-columns:\n        repeat(auto-fit, minmax(300px, 1fr));\n    gap: 30px;\n    text-align: center;\n}\n\n#portfolio {\n    text-align: center;\n}\n\n.portfolio img {\n    width: 100%;\n    border-radius: 25px;\n    object-fit: cover;\n    height: 300px;\n    background: #ddd;\n    transition: 0.3s;\n}\n\n.portfolio img:hover {\n    transform: scale(1.02);\n}\n\n.gallery-img {\n    cursor: pointer;\n}\n\n#lightbox {\n    position: fixed;\n    inset: 0;\n    background: rgba(0, 0, 0, .85);\n\n    display: none;\n    justify-content: center;\n    align-items: center;\n\n    z-index: 9999;\n}\n\n#lightbox.active {\n    display: flex;\n}\n\n#lightbox img {\n    max-width: 90%;\n    max-height: 90%;\n    border-radius: 20px;\n}",
    "download": "code/identity.css"
  }
];
