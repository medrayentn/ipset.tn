
//Show / Hide Password

document.querySelectorAll(".contact .php-email-form .fas.fa-eye").forEach(toggleIcon => {
  const pswrdField = toggleIcon.parentElement.querySelector("input[type='password']");
  toggleIcon.onclick = () => {
    if (pswrdField.type === "password") {
      pswrdField.type = "text";
      toggleIcon.classList.add("active");
    } else {
      pswrdField.type = "password";
      toggleIcon.classList.remove("active");
    }
  };
});
