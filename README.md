# amazon-api-scrapper
Used to search procuts in amazon quickly

STEPS:
- Necessary the "npm", Node to get the frameworks and libs to install and work with the back and front
- Install bun (npm install -g bun # the last `npm` command you'll ever need) (mininum version Win 10 – 1809) 
- Just with the 'bun' installed we can install the other frameworks directly
    - use: bun add express axios jsdom cors
    - just with this command we install the four in one time
    - again with bun we can use to install the 'vite' to the frontend
    - use: bun create vite frontend --template vanilla
    - will install and create a new folder called 'frontend'
    - enter in this folder 'cd frontend'
    - inside the folder do again: bun install
    - with this will install all needed dependency

- When all the code are OK, just need open two terminal
    - First Terminal runs: bun run server.js
    - Second Terminal runs: bun run dev

- With the 'vite' normally open in the port 5173, so go to the browser and paste:
- http://localhost:5173/
- Just do the search
