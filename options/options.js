const STORAGE_USE_GH_API = 'bors-extension-use-gh-api';
const STORAGE_GH_API_TOKEN = 'bors-extension-gh-api-token';

/*
Store the currently selected settings using browser.storage.local.
*/
function storeSettings() {
  const shouldUseApi = document.getElementById('api-option').checked;
  const ghToken = document.getElementById('gh-token').value;

  const loading = document.getElementById('loading-message');
  const success = document.getElementById('success-message');

  success.style.display = 'none';
  loading.style.display = 'initial'

  browser.storage.sync.set({
    [STORAGE_USE_GH_API]: shouldUseApi,
    [STORAGE_GH_API_TOKEN]: ghToken,
  });

  // Artificial timeout to provide affordance for user
  setTimeout(() => {
    success.style.display = 'initial';
    loading.style.display = 'none'
  }, 500);
}

/*
Update the options UI with the settings values retrieved from storage,
or the default settings if the stored settings are empty.
*/
function updateUI() {
  browser.storage.sync.get().then(storeSettings => {
    document.getElementById('api-option').checked = storeSettings[STORAGE_USE_GH_API];
    document.getElementById('gh-token').value = storeSettings[STORAGE_GH_API_TOKEN];
  });
}

updateUI();

const saveButton = document.getElementById("save-button");
saveButton.addEventListener("click", storeSettings);