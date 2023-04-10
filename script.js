const lengthSlider = document.querySelector(".pass-length input");
const passLength = document.querySelector(".pass-length span");
const options = document.querySelectorAll(".option input");
const copyIcon = document.querySelector(".input-box span");
const passwordInput = document.querySelector(".input-box input");
const passIndicator = document.querySelector(".pass-indicator");
const generateBtn = document.querySelector(".generate-btn");
const wordsOption = document.querySelector("#words");
const lowercaseOption = document.querySelector("#lowercase")
const uppercaseOption = document.querySelector("#uppercase")
const numbersOption = document.querySelector("#numbers")
const symbolsOption = document.querySelector("#symbols")
const excludeDupsOption = document.querySelector("#exc-duplicate")



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
  console.log("----------generatePassword function ran------------");

  if (wordsOption.checked) {
    const numWords = lengthSlider.value;
    let words = [];
    console.log("wordsOption is checked")
    words = await getWords(numWords);
    passwordInput.value = words.join("");
    document.querySelector(".pass-length span").innerHTML = lengthSlider.value;
  } else {
    let staticPassword = "";
    options.forEach((option) => {
      if (option.checked && option.id !== "words" && option.id !== "exc-duplicate") {
        staticPassword += characters[option.id];
      }
    });

    let randomPassword = "";
    for (let i = 0; i < lengthSlider.value; i++) {
      let randomChar = staticPassword[Math.floor(Math.random() * staticPassword.length)];
      randomPassword += randomChar;
    }
    passwordInput.value = randomPassword;
  }

  console.log("passwordInput Length = " + passwordInput.value.length);
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
  passLength.innerHTML = lengthSlider.value;

  generatePassword();
  updatePassIndicator();

  console.log("passwordInput Length = " + passwordInput.value.length)
};

const copyPassword = () => {
    navigator.clipboard.writeText(passwordInput.value);
    copyIcon.innerText = "check";
    copyIcon.style.color = "#43A047";
    setTimeout(() => {
        copyIcon.innerText = "copy_all";
        copyIcon.style.color = "#707070";
    }, 1000);
}

const passInputHeightCheck = () => {
  if (passwordInput.scrollHeight > passwordInput.clientHeight) {
    passwordInput.style.height = passwordInput.scrollHeight + "px";
  }
};



copyIcon.addEventListener("click", copyPassword);
lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click", generatePassword);
passwordInput.addEventListener("change", function () {
    passInputHeightCheck();
    console.log("passwordInput changed...")
});

options.forEach((option) => {
    if (option.id !== "words") {
        option.addEventListener("change", function () {
            generatePassword();
        });
    }
    option.addEventListener("click", () => {
        if(option.checked){
            
        }else{
            if (!option.checked && document.querySelectorAll(".option input:checked").length === 1 && option.id !== "exc-duplicate") {
                option.checked = true;
            }
        }
    });
});

wordsOption.addEventListener("change", function () {
    if (this.checked) {
        options.forEach(option => {
            if (option.id !== "words") {
                option.checked = false;
                option.disabled = true;
                lengthSlider.value = 3
            }
        });
        passInputHeightCheck()
        updateSlider()
        console.log("passwordInput length changed =" + passwordInput.value.length)
    }else{
        options.forEach(option => {
            if (option.id !== "words") {
                option.checked = true;
                option.disabled = false;
                generatePassword();
            }
        });
        passInputHeightCheck()
        updateSlider()
    }
})

updateSlider();
generatePassword();
