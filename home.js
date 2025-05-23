document.addEventListener("DOMContentLoaded", function() {
    
const itemsPerPage = 15;
let currentPage = 0;
let allItems = []; 
let savedUserItems = JSON.parse(localStorage.getItem("userItems")) || [];
let items = ""

    // Initially, set the first dot as active
    updateProfileUserName();
    
     
const saveDataButton = document.getElementById('saveDataButton');
const addButton = document.getElementById("add-item-button");
const deleteButton = document.getElementById("delete-item-button");
const clearAllButton = document.getElementById("clearall-item-button");
const openModalButton = document.getElementById("itemAddButton");
const modalOverlay = document.getElementById("hoverOverlay");
const closeModalButton = document.getElementById("closehoverButton");
const closePopupMessage = document.getElementById("closePopup");
const userDetailsSaveButton = document.getElementById("save-userdetails-button");
const accountSetupButton = document.getElementById("account-setup-button");
const viewPredefinedItemsButton = document.getElementById("view-predefined-items-button");
const viewUserdefinedItemsButton = document.getElementById("view-userdefined-items-button");
const welcomePageButton = document.getElementById("welcome-page-button");
const refreshButton = document.getElementById("refreshButton");
const logoutButton = document.getElementById("backtoLoginPageButton");
const billingPageButton = document.getElementById("billingPageButton");
const billHistoryButton = document.getElementById("billHistoryPageButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");


    // Attach event listeners to the buttons
    saveDataButton.addEventListener("click", saveallItems);
    addButton.addEventListener("click", addUserItem);
    deleteButton.addEventListener("click", deleteUserItem);
    clearAllButton.addEventListener("click", DeleteUserItemsToLocalStorage);
    openModalButton.addEventListener("click", openModal);
   closeModalButton.addEventListener("click", closeModal);
   closePopupMessage.addEventListener("click", closePopup);
   userDetailsSaveButton.addEventListener("click", saveUserDetails);
   accountSetupButton.addEventListener("click", displayAccountSetup);
   viewPredefinedItemsButton.addEventListener("click", displayViewPredefinedItems);
   viewUserdefinedItemsButton.addEventListener("click", displayViewUserdefinedItems);
   welcomePageButton.addEventListener("click", displayWelcomePage);
   refreshButton.addEventListener("click", refreshPage);
   logoutButton.addEventListener("click", navigateToLoginPage);
   billingPageButton.addEventListener("click", billingPage);
   billHistoryButton.addEventListener("click", billHistoryPage);
    prevButton.addEventListener("click", clickPrevButton);  
    nextButton.addEventListener("click", clickNextButton);
    
    
function updateProfileUserName() {
    // Update the profile box with the username
    var username = localStorage.getItem("username");
    var profileNameElement = document.querySelector(".profile-name");
    const welcomePageMsg = document.getElementById("welcomeMessageText");
    if (profileNameElement) {
        profileNameElement.textContent = username;
        welcomePageMsg.textContent = "Welcome " + username + "!";
    }

}

    
const gallery = document.querySelector(".gallery");
const galleryDots = document.querySelector(".gallery-dots");
    gallery.addEventListener("scroll", updateActiveDot);

function updateActiveDot() {
        const scrollLeft = gallery.scrollLeft;
        const itemWidth = gallery.querySelector(".gallery__item").offsetWidth;
        const activeIndex = Math.round(scrollLeft / itemWidth);

        const dots = galleryDots.querySelectorAll(".gallery-dot");

        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }

    // Create dots based on the number of gallery items
    const galleryItems = gallery.querySelectorAll(".gallery__item");

    galleryItems.forEach((item, index) => {
        const dot = document.createElement("div");
        dot.classList.add("gallery-dot");
        dot.addEventListener("click", () => scrollToItem(index));
        galleryDots.appendChild(dot);
    });

function scrollToItem(index) {
        const itemWidth = galleryItems[0].offsetWidth;
        gallery.scrollTo({
            left: index * itemWidth,
            behavior: "smooth"
        });
    }

 // Initially, set the first dot as active
    updateActiveDot();
    updateItemCountLabel();


// Function to open the modal
function openModal() {
    modalOverlay.style.display = "block";
}

// Function to close the modal
function closeModal() {
    modalOverlay.style.display = "none";
}

function addUserItem() {
        const userInputItemName = document.getElementById("userInputItemName").value.trim();
        const userInputPrice = parseFloat(document.getElementById("userInputPrice").value);
        const userInputQuantity = parseInt(document.getElementById("userInputQuantity").value);

        if (userInputItemName !== "") {
            const newItem = { name: userInputItemName };

            if (!isNaN(userInputPrice)) {
                newItem.price = userInputPrice;
            }

            if (!isNaN(userInputQuantity)) {
                newItem.quantity = userInputQuantity;
            }

            savedUserItems.push(newItem);
            document.getElementById("userInputItemName").value = ""; // Clear the item name field
            document.getElementById("userInputPrice").value = ""; // Clear the price field
            document.getElementById("userInputQuantity").value = ""; // Clear the quantity field
            saveUserItemsToLocalStorage();
            refreshUserItemsTable();
            closeModal();
            showSuccessMessage(userInputItemName, "Added");
        }
    }

function updateItemCountLabel_old() {
    const userItemsTable = document.getElementById("userItemsTable");
    const userItemsTableBody = userItemsTable.querySelector("tbody");
    const itemCountLabel = document.getElementById("itemCountLabel");

    const itemCount = userItemsTableBody.rows.length;
    itemCountLabel.textContent = `Your Items: (${itemCount} Items)`;
}


function deleteUserItem() {

        var itemToRemove = prompt("Enter Name of the item to remove");
        
        if (itemToRemove === null) {
        return; // Exit the function without further processing
    }
        
        const itemToDelete = itemToRemove.trim().toLowerCase();

        if (itemToDelete !== "") {
            // Check if the item is predefined
                const index = savedUserItems.findIndex((item) =>
                    item.name && item.name.toLowerCase() === itemToDelete
               );

                if (index !== -1) {
                    savedUserItems.splice(index, 1); // Remove the item
                    saveUserItemsToLocalStorage();
refreshUserItemsTable();
showSuccessMessage(itemToRemove, "Deleted");
                } else {
                    alert("Please enter the correct item name.");
                }
            }
        
    }

function refreshUserItemsTable() {
        userItemsTable.querySelector("tbody").innerHTML = ""; // Clear the user items table
        allItems = [...items, ...savedUserItems];
        allItems.forEach((item) => {
            const row = userItemsTable.querySelector("tbody").insertRow();
            row.insertCell(0).textContent = item.name;
            row.insertCell(1).textContent = item.price || "";
            row.insertCell(2).textContent = item.quantity || "";
        });
        updateItemCountLabel();
        displayItems(currentPage);
    }
    

function saveUserItemsToLocalStorage() {
        localStorage.setItem("userItems", JSON.stringify(savedUserItems));
    }
    
function saveallItems() {
    // First, get the existing items from local storage
    
    localStorage.removeItem("totalItems");
    
    let totalItems = [...allItems, ...savedUserItems];

    // Save the merged items back to local storage
    localStorage.setItem("totalItems", JSON.stringify(totalItems));
}


function DeleteUserItemsToLocalStorage() {
        const confirmation = confirm("Are you sure you want to delete all your user-defined items? This action cannot be undone.");
        if (confirmation) {
            localStorage.removeItem("userItems");
            alert("All user-defined items have been deleted successfully.");
            refreshUserItemsTable();
            showSuccessMessage("All Items added by user", "Deleted");
        }
    }
    
function showSuccessMessage(filename, strEvent) {

            // Show the message popup
            var successMessage = document.getElementById("successMessage");
            var successMessageText = document.getElementById("successMessageText");
            successMessage.style.display = "block";
            successMessageText.textContent = filename + " is " + strEvent + " successfully.";
            
            // Hide the delete message after 5 seconds
            setTimeout(function () {
               // location.reload();
                successMessage.style.display = "none";
            }, 5000);
         
}

function closePopup() {
    var successMessage = document.getElementById("successMessage");
    successMessage.style.display = "none";
}

function saveUserDetails() {
    const userNameInput = document.getElementById("userNameInput").value;
    const userPhoneNumberInput = document.getElementById("userPhoneNumberInput").value;
    const userShopNameInput = document.getElementById("userShopNameInput").value;
    const userShopAddressInput = document.getElementById("userShopAddressInput").value;
    const userThankYouNoteInput = document.getElementById("userThankYouNoteInput").value;
    const cashierName = document.getElementById("cashierName").value;

    // Create an object to store user details
    const userDetails = {
        userName: userNameInput,
        phoneNumber: userPhoneNumberInput,
        shopName: userShopNameInput,
        shopAddress: userShopAddressInput,
        thankYouNote: userThankYouNoteInput,
        selectedCashier: cashierName,
    };

    // Store the user details in local storage as a JSON string
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
}

function fetchUserDetails() {

    const storedUserDetails = localStorage.getItem("userDetails");

    // Define default values in an array
    const defaultValues = {
        userName: "",
        userMobileNumber: "",
        shopName: "JMart Stores",
        shopAddress: "Elayirampannai",
        thankYouNote: "Thank you for shopping at JMart Stores",
        cashierName: "",
    };

    if (storedUserDetails) {
        // Parse the JSON string back into an object
        const userDetails = JSON.parse(storedUserDetails);

        // Populate the input fields with the stored user details
        document.getElementById("userNameInput").value = userDetails.userName || defaultValues.userName;
        document.getElementById("userPhoneNumberInput").value = userDetails.phoneNumber || defaultValues.userMobileNumber;
        document.getElementById("userShopNameInput").value = userDetails.shopName || defaultValues.shopName;
        document.getElementById("userShopAddressInput").value = userDetails.shopAddress || defaultValues.shopAddress;
        document.getElementById("userThankYouNoteInput").value = userDetails.thankYouNote || defaultValues.thankYouNote;
        document.getElementById("cashierName").value = userDetails.selectedCashier || defaultValues.cashierName;
    } else {
        // Set default values from the array
        document.getElementById("userShopNameInput").value = defaultValues.shopName;
        document.getElementById("userShopAddressInput").value = defaultValues.shopAddress;
        document.getElementById("userThankYouNoteInput").value = defaultValues.thankYouNote;
    }

}

function displayAccountSetup() {
    var viewWelcomePage = document.getElementById("welcomePage");
    viewWelcomePage.style.display = "none";
    var viewPredefinedItems = document.getElementById("predefinedItems");
    viewPredefinedItems.style.display = "none";
    var viewDisplayAccountSetup = document.getElementById("accountInfoDetails");
    var viewUserdefinedItems = document.getElementById("userdefinedItems");
    viewUserdefinedItems.style.display = "none";
    viewDisplayAccountSetup.style.display = "block";
    fetchUserDetails();
}

function displayViewPredefinedItems() {
    
    var viewWelcomePage = document.getElementById("welcomePage");
    viewWelcomePage.style.display = "none";
    var viewDisplayAccountSetup = document.getElementById("accountInfoDetails");
    viewDisplayAccountSetup.style.display = "none";
    var viewUserdefinedItems = document.getElementById("userdefinedItems");
    viewUserdefinedItems.style.display = "none";
    var viewPredefinedItems = document.getElementById("predefinedItems");
    viewPredefinedItems.style.display = "block";
    fetchPredefinedItems();
}

function displayViewUserdefinedItems() {
    
    var viewWelcomePage = document.getElementById("welcomePage");
    viewWelcomePage.style.display = "none";
    var viewDisplayAccountSetup = document.getElementById("accountInfoDetails");
    viewDisplayAccountSetup.style.display = "none";
    var viewPredefinedItems = document.getElementById("predefinedItems");
    viewPredefinedItems.style.display = "none";
    var viewUserdefinedItems = document.getElementById("userdefinedItems");
    viewUserdefinedItems.style.display = "block";
    fetchUserdefinedItems();
}

function displayWelcomePage() {
    
    var viewDisplayAccountSetup = document.getElementById("accountInfoDetails");
    viewDisplayAccountSetup.style.display = "none";
    var viewPredefinedItems = document.getElementById("predefinedItems");
    viewPredefinedItems.style.display = "none";
    var viewUserdefinedItems = document.getElementById("userdefinedItems");
    viewUserdefinedItems.style.display = "none";
    var viewWelcomePage = document.getElementById("welcomePage");
    viewWelcomePage.style.display = "block";
}

function showLoading() {
  var loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) {
    loadingOverlay.style.display = "flex"; // Show the loading overlay
  }
}

function navigateToLoginPage() {
  showLoading();
  setTimeout(function() {
    window.location.href = "index.html"; // Replace with the actual home page URL
  }, 2000); // 3000 milliseconds = 3 seconds
}

function refreshPage() {
  showLoading();
  setTimeout(function() {
    var currentUrl = window.location.href;
    window.location.href = currentUrl;
  }, 2000); 
    
   }
   
function billingPage() {
  accessData();
  showLoading();
  setTimeout(function() {
    window.location.href = "about.html";
  }, 2000); 
    
   }
   
function billHistoryPage() {
  showLoading();
  setTimeout(function() {
    window.location.href = "services.html";
  }, 2000); 
    
   }
   
                 

function fetchPredefinedItems_old() {
                try {
                    // Access the content of the iframe and retrieve the data
                    const dataDocument = dataFrame.contentDocument || dataFrame.contentWindow.document;
                    const dataScript = dataDocument.getElementById('data');
                    
                    if (dataScript) {
                        const items = JSON.parse(dataScript.textContent);
                        let allItems = [...items, ...savedUserItems];
                        
                           const userItemsTable = document.getElementById("userItemsTable");
    const userItemsTableBody = userItemsTable.querySelector("tbody");
    allItems.forEach((item) => {
        const row = userItemsTableBody.insertRow();
        row.insertCell(0).textContent = item.name;
        row.insertCell(1).textContent = item.price || "";
        row.insertCell(2).textContent = item.quantity || "";
    });
    displayItems(page, allItems1);
                    }
                } catch (error) {
                    console.error("Error collecting data:", error);
                }
            }
        

function fetchPredefinedItems_old() {
    try {
        // Access the content of the iframe and retrieve the data
        const dataDocument = dataFrame.contentDocument || dataFrame.contentWindow.document;
        const dataScript = dataDocument.getElementById('data');

        if (dataScript) {
            const items = JSON.parse(dataScript.textContent);
            allItems = [...items, ...savedUserItems]; // Assign to the globally defined allItems

            // Call displayItems with the current page
            displayItems(currentPage);
            updatePageNumbers();
            updateItemCountLabel();
        }
    } catch (error) {
        console.error("Error collecting data:", error);
    }
}

function accessData() {
    try {
        const dataDocument = dataFrame.contentDocument || dataFrame.contentWindow.document;
        const dataScript = dataDocument.getElementById('data');

        if (dataScript) {
            const items = JSON.parse(dataScript.textContent);
            console.log("Total items fetched:", items.length); // Debug log
            predefinedItems = [...items, ...savedUserItems];
            console.log("Total items fetched including Saved User Items", predefinedItems.length); // Debug log
            
            // Store predefinedItems in local storage
            localStorage.setItem("predefinedItems", JSON.stringify(predefinedItems));
        
        }
    } catch (error) {
        console.error("Error collecting data:", error);
    }
}

function displayItems(page) {
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToDisplay = predefinedItems.slice(start, end);

    const userItemsTable = document.getElementById("preItemsTable");
    const userItemsTableBody = userItemsTable.querySelector("tbody");

    // Clear the table before adding new items
    userItemsTableBody.innerHTML = "";

    itemsToDisplay.forEach((item) => {
        const row = userItemsTableBody.insertRow();
        row.insertCell(0).textContent = item.name;
        row.insertCell(1).textContent = item.price || "";
        row.insertCell(2).textContent = item.quantity || "";
    });
}

function fetchPredefinedItems() {

            // Call displayItems with the current page
            accessData();
            displayItems(currentPage);
            updatePageNumbers(predefinedItems);
            updateItemCountLabel();
        
}

function clickNextButton() {
    if (currentPage < Math.ceil(predefinedItems.length / itemsPerPage) - 1) {
        currentPage++;
        displayItems(currentPage);
        updatePageNumbers();
        updateItemCountLabel();
    }
}

function clickPrevButton(){
    if (currentPage > 0) {
        currentPage--;
        displayItems(currentPage);
        updatePageNumbers();
        updateItemCountLabel();
    }
}
 
function updateItemCountLabel() {
    const itemCountLabel = document.getElementById("itemCountLabel");

    const totalItemCount = predefinedItems.length; // Use the length of allItems
    itemCountLabel.textContent = `Your Items: (${totalItemCount} Items)`;
}
        
        


function updatePageNumbers() {
    const totalPages = Math.ceil(predefinedItems.length / itemsPerPage);
    const pageNumbersContainer = document.getElementById("pageNumbers");
    pageNumbersContainer.innerHTML = `Page ${currentPage + 1} of ${totalPages}`;
}



function fetchUserdefinedItems() {

const userItemsTable = document.getElementById("userItemsTable");
    const userItemsTableBody = userItemsTable.querySelector("tbody");
      
    userItemsTableBody.innerHTML = "";

      //  allItems = [...items, ...savedUserItems];
        
        savedUserItems.forEach((item) => {
            const row = userItemsTableBody.insertRow();
            
            row.insertCell(0).textContent = item.name;
            row.insertCell(1).textContent = item.price || "";
            row.insertCell(2).textContent = item.quantity || "";
        });
        updateItemCountLabel();
        updatePageNumbers();
   
    }

});
