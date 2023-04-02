const lengthSlider = document.querySelector(".pass-length input");
const options = document.querySelectorAll(".option input");
const copyIcon = document.querySelector(".input-box span");
const passwordInput = document.querySelector(".input-box input");
const passIndicator = document.querySelector(".pass-indicator");
const generateBtn = document.querySelector(".generate-btn");

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

  options.forEach((option) => {
    if (option.checked) {
      if (option.id === "words") {
        const numWords = Math.ceil(lengthSlider.value / 3);
        const words = await getWords(numWords);
        staticPassword += words.join("");
        passLength = words.length;
      } else if (option.id !== "exc-duplicate") {
        staticPassword += characters[option.id];
      } else {
        excludeDuplicate = true;
      }
    }
  });

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
  updatePassIndicator();
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

const updateSlider = () => {
    document.querySelector(".pass-length span").innerText = lengthSlider.value;
    generatePassword();
    updatePassIndicator();
}
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