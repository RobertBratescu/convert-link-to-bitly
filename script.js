"use strict";
let includesQ;
// require("dotenv").config();
//Declaring the elements
const theURLel = document.getElementById("final-utm-link");
const displayBitlyLink = document.getElementById("display-new-bitly");
const genButton = document.getElementById("generate-bitly-link");
//Declaring the inputs
const inputElements = document.querySelectorAll("input");
const longLinkEl = document.querySelector(".long-link"); //Required value
const bitlyTitleEl = document.querySelector(".doc-title"); //Required value
//Declaring parameter elements
const cmpIdEl = document.querySelector(".cmp-id");
const cmpSourceEl = document.querySelector(".cmp-source"); //Required value
const cmpMediumEl = document.querySelector(".cmp-medium"); //Required value
const cmpNameEl = document.querySelector(".cmp-name"); //Required value
const cmpTermEl = document.querySelector(".cmp-term");
const cmpContentEl = document.querySelector(".cmp-content");
//Declaring the check minimum values function
function checkMinimumValues() {
  if (longLinkEl.value && bitlyTitleEl.value && cmpSourceEl.value && cmpMediumEl.value && cmpNameEl.value) {
    return true;
  } else {
    alert("Please fill in the requiered fields");
    return false;
  }
}
//Connection to API
const userUID = "Bj4hdnemRdp";
const bitlyAPIToken = "46b4cd1c323b57f7a324a178d1423bd9d38c8df0";
//Declaring the function that starts the API
function startFetch() {
  if (checkMinimumValues()) {
    fetch("https://api-ssl.bitly.com/v4/shorten", {
      method: "POST",
      headers: {
        Authorization: bitlyAPIToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ long_url: encodeURI(theURLel.textContent), group_guid: userUID }),
    })
      .then((response) => response.json())
      .then((json) => {
        displayBitlyLink.textContent = json.id;
        console.log(`${json.id} has been generated successfully!`);
        // Copy to clipboard function
        function copyToClipboard() {
          displayBitlyLink.classList.add("green");
          /* Copy the text inside the text field */
          navigator.clipboard.writeText(json.id);
          console.log(`${json.id} copied to clipboard`);
        }
        //Calling the copyToClipboard function
        displayBitlyLink.addEventListener("click", copyToClipboard);
        //Another fetch to set the title in Bit.ly
        fetch(`https://api-ssl.bitly.com/v4/bitlinks/${json.id}`, {
          method: "PATCH",
          headers: {
            Authorization: bitlyAPIToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: String(bitlyTitleEl.value) }),
        });
      });
  }
}
//Assign the Fetching function
genButton.addEventListener("click", startFetch);
//Declaring function that composes the final link
function composeLongLink() {
  // Check if longLinkEl has "?"
  includesQ = longLinkEl.value.includes("?") ? true : false;
  //Declare value variables
  let idVal = cmpIdEl.value ? "&" + "utm_id=" + cmpIdEl.value : "";
  let sourceVal = cmpSourceEl.value ? "&" + "utm_source=" + cmpSourceEl.value : "";
  let mediumVal = cmpMediumEl.value ? "&" + "utm_medium=" + cmpMediumEl.value : "";
  let nameVal = cmpNameEl.value ? "&" + "utm_campaign=" + cmpNameEl.value : "";
  let termVal = cmpTermEl.value ? "&" + "utm_term=" + cmpTermEl.value : "";
  let contentVal = cmpContentEl.value ? "&" + "utm_content=" + cmpContentEl.value : "";
  let hasParams = idVal || sourceVal || mediumVal || nameVal || termVal || contentVal ? true : false;
  //Form the final link
  theURLel.textContent = `${longLinkEl.value}${!includesQ && hasParams ? "?" : ""}${sourceVal}${mediumVal}${nameVal}${idVal}${termVal}${contentVal}`.replace("?&", "?");
}

//Add event listeners to each input element
for (let i = 0; i < inputElements.length; i++) {
  inputElements[i].addEventListener("input", composeLongLink);
}
