const lengthSlider = document.querySelector(".pass-length input");
const options = document.querySelectorAll(".option input");
const copyIcon = document.querySelector(".input-box span");
const passwordInput = document.querySelector(".input-box input");
const passIndicator = document.querySelector(".pass-indicator");
const generateBtn = document.querySelector(".generate-btn");
const wordsOption = document.querySelector("#words");


const characters = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!$%&|[](){}:;.,*+-#@<>~"
}

const getWords = async (numWords) => {

    const wordsAPI = `https://random-word-api.vercel.app/api?words=${numWords}&length=9`;

    try {
        const response = await fetch(wordsAPI);
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error(error);
    }
};

const generatePassword = async () => {
  let staticPassword = "";
  let randomPassword = "";
  let excludeDuplicate = false;
  let passLength = lengthSlider.value;

  for (const option of options) {
    if (option.checked) {
      if (option.id === "words") {
        const numWords = lengthSlider.value;
        const words = await getWords(numWords);
        staticPassword += words.join("");
        passLength = words.length;
      } else if (option.id !== "exc-duplicate") {
        staticPassword += characters[option.id];
      } else {
        excludeDuplicate = true;
      }
    }
  }

  if (staticPassword !== "") {
    for (let i = 0; i < passLength; i++) {
      let randomChar =
        staticPassword[Math.floor(Math.random() * staticPassword.length)];
      if (excludeDuplicate) {
        !randomPassword.includes(randomChar)
          ? (randomPassword += randomChar)
          : i--;
      } else {
        randomPassword += randomChar;
      }
    }
    passwordInput.value = randomPassword;
  }
};



const updatePassIndicator = () => {
    passIndicator.id =
        lengthSlider.value <= 6
        ? "weakest"
        : lengthSlider.value <= 12
        ? "weak"
        : lengthSlider.value <= 18
        ? "medium"
        : "strong";
};

const updateSlider = async () => {

    passwordInput.value = ""

    document.querySelector(".pass-length span").innerHTML = lengthSlider.value
    const numWords = lengthSlider.value;
    let words = [];
    
    if (wordsOption.checked) {
        words = await getWords(numWords);
        passwordInput.value = words.join("");
    } else {
        const staticPassword = Object.values(characters).join("");
        let randomPassword = "";

        for (let i = 0; i < lengthSlider.value; i++) {
        let randomChar = staticPassword[Math.floor(Math.random() * staticPassword.length)];
        randomPassword += randomChar;
        }

        passwordInput.value = randomPassword;
    }
    
    updatePassIndicator();
};

updateSlider();

const copyPassword = () => {
    navigator.clipboard.writeText(passwordInput.value);
    copyIcon.innerText = "check";
    copyIcon.style.color = "#43A047";
    setTimeout(() => {
        copyIcon.innerText = "copy_all";
        copyIcon.style.color = "#707070";
    }, 1000);
}

copyIcon.addEventListener("click", copyPassword);
lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click", generatePassword);
wordsOption.addEventListener("change", function () {
    if (this.checked) {
        options.forEach(option => {
            if (option.id !== "words") {
                option.checked = false;
            }
        });
    }
    generatePassword()
})

updateSlider()
