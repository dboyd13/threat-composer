var raw_div = document.createElement("div");
raw_div.setAttribute("id", "raw-div");
raw_div.hidden = true;
document.querySelectorAll(".ace_editor")[0].setAttribute("id", "ace-editor");
var editor = window.ace.edit("ace-editor");
raw_div.textContent = editor.getSession().getValue();
document.body.appendChild(raw_div)