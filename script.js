const code = document.querySelector('#code')

const line = document.querySelector('#line')

const preview = document.querySelector('#preview')

const consoleDiv = document.querySelector('.console')

const submit = document.querySelector('.submit')

const editorConsole = document.querySelector('#console')

const codeLogo = document.querySelector('#codeLogo')

const consoleLogo = document.querySelector('#consoleLogo')

const panel = document.querySelector('.panel') 

function updateLine() {
  const lines = code.value.split("\n").length;
  let numbers = "";

  for (let i = 1; i <= lines; i++) {
    numbers += `<div>${i}</div>`
  }

  line.innerHTML = numbers;
}

code.addEventListener("input", updateLine);

code.addEventListener("scroll", () => {
  line.scrollTop = code.scrollTop;
});

updateLine();

code.addEventListener('keydown' , function(e){
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

            const bodyInd = code.value.indexOf('<body>') + 7
            code.selectionStart = code.selectionEnd = bodyInd
            updateLine()

        }
    }

    if (e.key === "Tab") {
            e.preventDefault();

            const start = code.selectionStart;
            const end = code.selectionEnd;

            code.value = code.value.substring(0, start) + "  " + code.value.substring(end);
          
            code.selectionStart = code.selectionEnd = start + 2;
    }
})

submit.addEventListener("click", () => {
  preview.src = "preview.html";

  preview.onload = () => {
    preview.contentWindow.postMessage(
      code.value,
      location.origin 
    );
  };
});

window.addEventListener("message", function (event) {

  if (!event.data) return;

  if (event.data.type === "console") {
    editorConsole.innerText += event.data.message + "\n";
    editorConsole.scrollTop = editorConsole.scrollHeight;
  }

});

async function handleSubmit() {
  clearConsole();
  await runPreview();
}

async function runPreview() {
  preview.src = "preview.html";
  await waitForIframe();
  sendUserCode();
}

function waitForIframe() {
  return new Promise(resolve => preview.onload = resolve);
}

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

const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", async function () {

  if (fileInput.files.length === 0) return;

  const file = fileInput.files[0];
  const content = await readFileAsText(file);

  code.value = content;   
  updateLine();
});



async function runPreview() {
  preview.src = "preview.html";

  await new Promise(function (resolve) {
    preview.onload = resolve;
  });

  preview.contentWindow.postMessage(code.value, location.origin);
}

submit.addEventListener("click", function () {
  runPreview();
});

codeLogo.addEventListener('click' , function(){
  code.value = ''
  fileInput.value = null ;
})

let isDisplay = false

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

