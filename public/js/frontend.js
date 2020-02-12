
const login = document.querySelector(".login");
const signup = document.querySelector(".signup");
const bookPlan = document.querySelector(".bookPlan");

var stripe = Stripe('pk_test_VDIjMlFG1hsqg0WzwRLLFv6Y00vhrwfBMG');

async function sendLogin(email, password) {
  try {
    const response = await axios.post("/api/users/login", { email, password });
    if (response.data.success) {
      alert("User logged in");
      location.assign("/me");//location is an object of browser so it only works in frontend
    }
    else
      alert("Something went wrong");
  } catch (err) {
    console.log(err);
  }
}

if (login) {
  login.addEventListener("submit", function (event) {
    event.preventDefault();
    // console.log("dkfslfj");
    const inputArr = document.getElementsByTagName("input");
    const email = inputArr[0].value;
    const password = inputArr[1].value;
    sendLogin(email, password);
  })
}

async function sendSignUp(name, email, password, confirmPassword, phone) {
  try {
    const response = await axios.post("/api/users/signup", { name, email, password, confirmPassword, phone });
    if (response.data.success) {
      alert("Successful sign up.");
      location.assign("/me");
    }
    else
      alert("Something went wrong.");
  } catch (err) {
    console.log(err)
  }
}

if (signup) {
  signup.addEventListener("submit", function (event) {
    event.preventDefault();
    const inputArr = document.getElementsByTagName("input");
    const name = inputArr[0].value;
    const email = inputArr[1].value;
    const password = inputArr[2].value;
    const confirmPassword = inputArr[3].value;
    const phone = inputArr[4].value;
    sendSignUp(name, email, password, confirmPassword, phone);
  })
}

if (bookPlan) {
  bookPlan.addEventListener("click", async function (e) {
    e.preventDefault();
    const id = bookPlan.getAttribute("id");
    const response = await axios.get("/api/booking/" + id);
    const session = response.data.session;
    // console.log(session);

    stripe.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: session.id
    }).then(async function (result) {
      console.log(result);
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
      // if(result.error.message){
        
      // }

    });


  })
}