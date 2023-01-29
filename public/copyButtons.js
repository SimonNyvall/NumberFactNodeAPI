
// Copy Buttons
const getAll_btn = document.getElementById('GetAll-btn')
const getById_btn = document.getElementById('GetById-btn')
const addFact_btn = document.getElementById('AddFact-btn')
const addRandom_btn = document.getElementById('AddRandom-btn')
const update_btn = document.getElementById('Update-btn')
const delete_btn = document.getElementById('Delete-btn')

getAll_btn.onclick = () => {
    navigator.clipboard.writeText("https://numberfact.azurewebsites.net/ShowAllFacts")
}

getById_btn.onclick = () => {
    navigator.clipboard.writeText("https://numberfact.azurewebsites.net/GetFactById/")
}

addFact_btn.onclick = () => {
    navigator.clipboard.writeText("https://numberfact.azurewebsites.net/AddFact/")
}

addRandom_btn.onclick = () => {
    navigator.clipboard.writeText("https://numberfact.azurewebsites.net/AddRandomFact")
}

update_btn.onclick = () => {
    navigator.clipboard.writeText("https://numberfact.azurewebsites.net/UpdateFact/")
}

delete_btn.onclick = () => {
    navigator.clipboard.writeText("https://numberfact.azurewebsites.net/DeleteFactById/")
}

