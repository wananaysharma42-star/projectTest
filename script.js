/* =======================
   DOM ELEMENT REFERENCES
   ======================= */

const code = document.querySelector('#code')

const line = document.querySelector('#line')

const preview = document.querySelector('#preview')

const consoleDiv = document.querySelector('.console')

const submit = document.querySelector('.submit')

const editorConsole = document.querySelector('#console')

const codeLogo = document.querySelector('#codeLogo')

const consoleLogo = document.querySelector('#consoleLogo')

const panel = document.querySelector('.panel') 

const themeToggle = document.querySelector('.logo')

const previewLogo = document.querySelector('#previewLogo')

const previewSection = document.querySelector('.preview')

const codeSection = document.querySelector('.codeSection')

const historyLogo = document.querySelector('.historyLogo') 

const title = document.querySelector('.title')

const history = document.querySelector('.history')

const fileInput = document.getElementById("fileInput");

/* =======================
   STATE VARIABLES
   ======================= */

// Stores saved code sessions
let codeArr = JSON.parse(localStorage.getItem("codeData")) || [];

// Controls title name in history section
let titleName = "";

// Controls title input visibility
let isVisible = false ;

// Prevents rapid duplicate saves
let isSaving = false;

// Console panel toggle state
let isDisplay = false;

// Preview layout toggle state
let isPreview = false ;

// Current editor theme
let currentTheme = "dark";

/* =======================
   LINE NUMBER HANDLING
   ======================= */

// Updates line numbers based on textarea content
function updateLine() {
  const lines = code.value.split("\n").length;
  let numbers = "";

  for (let i = 1; i <= lines; i++) {
    numbers += `<div>${i}</div>`
  }

  line.innerHTML = numbers;
}

// Sync line numbers on input & scroll
code.addEventListener("input", updateLine);

code.addEventListener("scroll", () => {
  line.scrollTop = code.scrollTop;
});

updateLine();

/* =======================
   EDITOR KEYBOARD FEATURES
   ======================= */

code.addEventListener('keydown' , function(e){
  // HTML boilerplate shortcut: type "!" and press Enter
    if(e.key === 'Enter'){
        const cursorPos = code.selectionStart
        const beforeText = code.value.slice(0 , cursorPos) 
        const currentLineIndex = beforeText.split('\n').length -1
        const allText = code.value.split('\n')
        const currentLineText = allText[currentLineIndex]
        if(currentLineText.trim() === '!'){
            e.preventDefault()
            const snippet = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`


            allText[currentLineIndex] = snippet
            code.value = allText.join('\n')

            // Move cursor inside <body>
            const bodyInd = code.value.indexOf('<body>') + 7
            code.selectionStart = code.selectionEnd = bodyInd
            updateLine()

        }
    }

    // Insert spaces instead of losing focus on Tab
    if (e.key === "Tab") {
            e.preventDefault();

            const start = code.selectionStart;
            const end = code.selectionEnd;

            code.value = code.value.substring(0, start) + "  " + code.value.substring(end);
          
            code.selectionStart = code.selectionEnd = start + 2;
    }
})

/* =======================
   SUBMIT & TITLE HANDLING
   ======================= */

// Show title input when submitting code
submit.addEventListener("click", (e) => {
  e.stopPropagation() ;
  preview.src = "preview.html";
  runPreview();
  title.style.display = "block";
  isVisible = true ;
  title.focus();
});

// Hide title input on outside click
window.addEventListener('click' , function(e){
    if(!title.contains(e.target)){
      if(isVisible){
        if(!submit.contains(e.target)){
          title.style.display = 'none' ;
          isVisible = false ;
          return ;
        }
      }
    }
})

// Save code snapshot on Enter inside title input
title.addEventListener("keydown", function (e) {
  if (e.key !== "Enter") return;
  if (isSaving) return;

  e.preventDefault();

  const titleName = title.value.trim();
  if (!titleName) return;

  isSaving = true;

  // Add history UI entry
  const his = document.createElement("div");
  his.className = "his";
  his.innerText = titleName;
  history.appendChild(his);

  // Save snapshot
  const obj = {
    codeVal: code.value,
    consoleVal: editorConsole.innerHTML,
    title: titleName
  };

  // Limit history to 10 items
  if (codeArr.length >= 10){
    codeArr.shift();
    history.firstElementChild.remove() ;
  }
  codeArr.push(obj);

  localStorage.setItem("codeData", JSON.stringify(codeArr));

  // Reset title input
  title.value = "";
  title.style.display = "none";

  // allow next save
  setTimeout(() => isSaving = false, 200);
});

/* =======================
   CONSOLE MESSAGE HANDLING
   ======================= */

// Receive console logs from iframe
window.addEventListener("message", function (event) {

  if (!event.data) return;

  if (event.data.type === "console") {
    editorConsole.innerText += event.data.message + "\n";
    editorConsole.scrollTop = editorConsole.scrollHeight;
  }

});

// Clear custom console output
function clearConsole(){
  editorConsole.innerText = "";
}

/* =======================
   FILE IMPORT SUPPORT
   ======================= */

function readFileAsText(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();

    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = function () {
      reject("File read error");
    };

    reader.readAsText(file);
  });
}

fileInput.addEventListener("change", async function () {

  if (fileInput.files.length === 0) return;

  const file = fileInput.files[0];
  const content = await readFileAsText(file);

  code.value = content;   
  updateLine();
});

/* =======================
   PREVIEW EXECUTION
   ======================= */

// Reload iframe and send code for execution
async function runPreview() {
  preview.src = "preview.html";

  await new Promise(function (resolve) {
    preview.onload = resolve;
  });

  preview.contentWindow.postMessage({
    code : code.value ,
    theme : currentTheme
  }, location.origin);
}


/* =======================
   UI TOGGLES
   ======================= */

// Clear editor & file input
codeLogo.addEventListener('click' , function(){
  code.value = ''
  fileInput.value = null ;
})

// Toggle console panel
consoleLogo.addEventListener('click' , function(){
  if(!isDisplay){
    editorConsole.style.display = 'block' ;
    consoleDiv.style.height = '30%' ;
    panel.style.height = '70%' ;
    isDisplay = true ;
  }else{
    editorConsole.style.display = 'none' ;
    panel.style.height = '95%' ;
    consoleDiv.style.height = '5%' ;
    isDisplay = false ;
  }
})

// Toggle light / dark theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  currentTheme = document.body.classList.contains("light")
    ? "light"
    : "dark";
  runPreview();
});

/* =======================
   PREVIEW LAYOUT HANDLING
   ======================= */

// Toggle preview size on click
previewSection.addEventListener('click' , function(){
  if(window.innerWidth > 1024){
    if(!isPreview){
      previewSection.style.width = '50%'
      codeSection.style.width = '50%'
      previewSection.style.height = '100%'
      codeSection.style.height = '100%'
      isPreview = true
    }else{
      previewSection.style.width = '5%'
      codeSection.style.width = '95%'
      previewSection.style.height = '100%'
      codeSection.style.height = '100%'
      isPreview = false
    }
  }else if(window.innerWidth <= 1024){
    if(!isPreview){
      previewSection.style.height = '50%'
      codeSection.style.height = '50%'
      previewSection.style.width = '100%'
      codeSection.style.width = '100%'
      isPreview = true
    }else{
      previewSection.style.height = '5%'
      codeSection.style.height = '95%'
      previewSection.style.width = '100%'
      codeSection.style.width = '100%'
      isPreview = false
    }
  }
})

// Toggle between size of viewport
window.addEventListener('resize' , function(){
  if(window.innerWidth > 1024){
    if(isPreview){
      previewSection.style.width = '50%'
      codeSection.style.width = '50%'
      previewSection.style.height = '100%'
      codeSection.style.height = '100%'
      isPreview = true
    }else{
      previewSection.style.width = '5%'
      codeSection.style.width = '95%'
      previewSection.style.height = '100%'
      codeSection.style.height = '100%'
      isPreview = false
    }
  }else if(window.innerWidth <= 1024){
    if(isPreview){
      previewSection.style.height = '50%'
      codeSection.style.height = '50%'
      previewSection.style.width = '100%'
      codeSection.style.width = '100%'
      isPreview = true
    }else{
      previewSection.style.height = '5%'
      codeSection.style.height = '95%'
      previewSection.style.width = '100%'
      codeSection.style.width = '100%'
      isPreview = false
    }
  }
})

/* =======================
   HISTORY RESTORE
   ======================= */

// Reload saved sessions on page load
let reload = function(){
  data = JSON.parse(localStorage.getItem("codeData")) || [] ;
  if(data.length == 0){
    return ;
  }
  code.value = data[data.length-1].codeVal ;
  editorConsole.innerHTML = data[data.length-1].consoleVal ;
  data.forEach((obj) => {
    let his = document.createElement('div')
    his.className = 'his'
    history.appendChild(his)
    his.innerText = obj.title
  })
} 

reload() ;

// Toggle history panel
historyLogo.addEventListener('click' , function(){
  if(history.style.display == 'block'){
    history.style.display = 'none'
  }else{
    history.style.display = 'block'
  }
})

// Load selected history item
history.addEventListener('click' , function(e){
  let val = e.target.innerText
  let data = JSON.parse(localStorage.getItem("codeData")) || [];
  data.forEach((obj) => {
    if(obj.title == val){
      code.value = obj.codeVal
      editorConsole.innerHTML = obj.consoleVal
    }
  })
})

