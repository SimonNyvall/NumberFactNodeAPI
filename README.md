# NumberFact API [![Build and deploy Node.js app to Azure Web App - NumberFact](https://github.com/SimonNyvall/NumberFactNodeAPI/actions/workflows/main_numberfact.yml/badge.svg)](https://github.com/SimonNyvall/NumberFactNodeAPI/actions/workflows/main_numberfact.yml)

https://numberfact.azurewebsites.net/

## About
NumberFact is a free API for retrieving information about numbers in the form of json documents. The API also allows sending post, put and delete requests for adding, editing and deleting data in the database.

## Methods
| CRUD Operation         | URL 
|--------------|-----------|
| GET | https://numberfact.azurewebsites.net/ShowAllFacts      |
| GET      | https://numberfact.azurewebsites.net/GetFactById/  | 
| POST      | https://numberfact.azurewebsites.net/AddFact/  | 
| POST      | https://numberfact.azurewebsites.net/AddRandomFact  | 
| UPDATE      | https://numberfact.azurewebsites.net/UpdateFact/  | 
| DELETE      | https://numberfact.azurewebsites.net/DeleteFactById/  | 