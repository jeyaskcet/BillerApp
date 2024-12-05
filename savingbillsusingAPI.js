function saveBill_new() {
    const customerName = document.getElementById('customerNameInput').value;
    const billNumberText = document.getElementById('billNumber').textContent;
    const billNumber = parseInt(billNumberText.replace("Bill Number:", "").trim(), 10);

    if (!customerName || !billNumber) {
        // Prompt the user to enter customer details
        alert('Please enter customer details before saving the bill.');
        return;
    }

    const billId = `${customerName}-${billNumber}`;
    const fileName = prompt('Enter bill file name:', billId);

    if (!fileName) return;

    // Set the HTML content and save it as a bill
    const billContent = document.getElementById('printableDetails').innerHTML;

    // Use the Google Drive API to save the bill content
    gapi.client.drive.files.create({
        resource: {
            name: fileName,
            mimeType: 'text/html', // Change the mimeType as needed
            parents: ['YOUR_FOLDER_ID'], // Replace with the folder ID where you want to store the files
        },
        media: {
            mimeType: 'text/html', // Change the mimeType as needed
            body: billContent,
        },
    }).then((response) => {
        console.log('File ID:', response.result.id);
        alert('Bill saved to Google Drive successfully!');
    }).catch((error) => {
        console.error('Error saving bill to Google Drive:', error);
        alert('Error saving bill to Google Drive. Please try again later.');
    });
}

// Load the Google API Client Library
gapi.load('client:auth2', () => {
    gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        clientId: 'YOUR_CLIENT_ID',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: 'https://www.googleapis.com/auth/drive.file', // Adjust scopes as needed
    }).then(() => {
        // Authorize and handle the sign-in status
        gapi.auth2.getAuthInstance().signIn().then(() => {
            // Application is authorized and ready to use the Google Drive API
        });
    });
}); 
