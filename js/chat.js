let chatId = 1;

/**
 * start chat button click
 */
async function startChat() {
  await fetch("./data/data.json")
    .then(response => {
      return response.json();
    })
    .then((jsondata) => {
      init(jsondata);
    });
}

/**
 * after start chat button click.
 * @param {*} jsondata 
 */
function init(jsondata) {
  currentData = findMessageInJsonById(jsondata, chatId);

  toggleLoader("show", document.getElementById("chat-window"));
  document.getElementById("start_chat").style.visibility = 'hidden';
  document.getElementById("flowchat").style.visibility = 'visible';
  setTimeout(function () {
    toggleLoader("remove");
    createBotMessage(jsondata, currentData);
  }, 3000);
}

/**
 * create options buttons.
 * @param {*} jsondata 
 * @param {*} currentData 
 */
function createOptions(jsondata, currentData) {
  let chatWindowEl = document.getElementById("chat-window");
  let optionContainer = document.createElement("li");
  optionContainer.classList.add("options");
  optionContainer.setAttribute('id', 'options');
  let optionList = document.createElement("ul");
  optionList.classList.add("options-list-style");

  for (let i = 0; i < currentData.options.length; i++) {
    let listItem = document.createElement("li");
    listItem.setAttribute("data-nextid", currentData.options[i].nextMessageId);
    listItem.innerText = currentData.options[i].text;
    listItem.addEventListener("click", function (event) {
      let nextMessageId = event.target.getAttribute("data-nextid");
      message = findMessageInJsonById(jsondata, nextMessageId);
      setTimeout(function () {
        selectOption(jsondata, listItem.innerText, message);
      }, 1500);
    });
    optionList.appendChild(listItem);
    optionContainer.appendChild(optionList);
  }
  chatWindowEl.appendChild(optionContainer);
}

/**
 * find message data by id.
 * @param {*} data 
 * @param {*} id 
 * @returns 
 */
function findMessageInJsonById(data, id) {
  let messages = data;

  for (var i = 0; messages.length > i; i++)
    if (messages[i].id == id) return messages[i];
}

/**
 * add and remove loader.
 * @param {*} status 
 * @param {*} chatWindow 
 */
function toggleLoader(status, chatWindow = null) {
  if (status == "show")
    chatWindow.innerHTML =
      "<li class='typing-indicator' id='typing-indicator'><span></span><span></span><span></span></li>";
  else document.getElementById("typing-indicator").remove();
}

/**
 * create select message.
 * @param {*} data 
 * @param {*} message 
 * @param {*} nextMessage 
 */
function selectOption(data, message, nextMessage = null) {
  // ask quest for user.
  let optionEl = document.getElementById("options");
  optionEl.remove();
  let chatWindowEl = document.getElementById("chat-window");
  let listItem = document.createElement("li");
  listItem.classList.add("user");
  let divItem = document.createElement("div");
  divItem.classList.add("text");
  divItem.innerText = message;
  listItem.appendChild(divItem);
  chatWindowEl.appendChild(listItem);

  // bot message
  if (nextMessage) {
    createBotMessage(data, nextMessage)
  }
}

/**
 * create bot message.
 * @param {*} data 
 * @param {*} message 
 */
function createBotMessage(data, message) {
  let chatWindowEl = document.getElementById("chat-window");
  let listItem = document.createElement("li");
  listItem.classList.add("bot");
  let divItem = document.createElement("div");
  divItem.classList.add("text");
  divItem.innerText = message.text;
  listItem.appendChild(divItem);
  chatWindowEl.appendChild(listItem);

  // play audio file.
  let audioCls = null;
  if (message.audioPath) {
    audioCls = new Audio(message.audioPath);
    audioCls && audioCls.play();
  }

  // to show next message.
  if (message.nextMessageId) {
    let newMessage = findMessageInJsonById(data, message.nextMessageId);
    setTimeout(function () {
      createBotMessage(data, newMessage)
    }, 1000);
  } else if (message.options) {
    createOptions(data, message);
  }
}