const indexfile = {} // put index.json here to work offline

var gotoBtn;
var worldsList;

// get JSON and generate page
const data = async () => {
   return fetch("https://raw.githubusercontent.com/DMsGuild201/Foundry_Resources/master/worlds/index.json")
      .then(response => {
         return response.json();
      }).catch(async err => {
         return indexfile;
         throw new Error("HTTP error " + err);
      });
};

// Handle page load
async function load() {

   // Handle go to top button
   gotoBtn = document.getElementById("gotoTop");
   window.onscroll = function () {
      scrollFunction()
   };

   // Create List
   var options = {
      valueNames: [
         "name",
         { attr: "onclick", name: "module" },
         { attr: "onclick", name: "world" },
         { attr: "onclick", name: "zip" },
         "description",
         "abbreviation",
         "version",
         "authors",
         "size"
      ],
      item: `<li>
                  <header id="FWtoggle">
                     <h1 id="FWtitle" class="name"></h1>
                     <div id="FWinstall">
                        <button id="FWinstall-dropdown" class="fa fa-download"></button>
                        <nav id="FWinstall-buttons">
                           <button id="FWinstall-module" class="module">Module</button>
                           <button id="FWinstall-world" class="world">World</button>
                           <button id="FWinstall-zip" class="zip">ZIP</button>
                        </nav>
                     </div>
                     <button id="FWtoggle-symbol"></button>
                  </header>
                  <content id="FWdetails">
                     <article id="FWdescription" class="description"></article>
                     <section id="FWsidebar">
                        <strong>Abbreviation: </strong><span class="abbreviation"></span><br/>
                        <strong>Version: </strong><span class="version"></span><br/>
                        <strong>Authors: </strong><span class="authors"></span><br/>
                        <strong>Size: </strong><span class="size"></span><br/>
                     </section>
                  </content>
               </li>`
   };
   worldsList = new List("FWworld-list", options);

   // Load data
   let result = await data()
   result.world.forEach(world => {

      // Get array of all unique authors
      let authorsArray = world.author;
      world.authors.forEach(item => {
         if (!authorsArray.includes(item.name)) {
            authorsArray.push(author.name);
         };
      });

      // Create string of authors
      let authorStr = authorsArray.join(", ");

      // Get install URLs (a bit hacky, but it will work for now)
      var abbr = world.manifesturl.replace("https://foundry.5e.tools/plutonium/", "").replace("/world.json", "");
      var modulemanifest = world.manifesturl.replace("/world.json", "/module.json");
      var zipdownload = world.manifesturl.replace("/world.json", `/${abbr}.zip`)

      // Fix boatgc having the wrong url
      if (world.manifesturl === "https://foundry.5e.tools/plutonium/b-aotgc/world.json") { world.manifesturl = "https://foundry.5e.tools/plutonium/baotgc/world.json" }

      // Add to list
      worldsList.add({
         name: world.name,
         module: `navigator.clipboard.writeText('${modulemanifest}')`,
         world: `navigator.clipboard.writeText('${world.manifesturl}')`,
         zip: `window.open('${zipdownload}')`,
         description: world.description,
         abbreviation: world.source,
         version: world.version,
         authors: authorStr,
         size: Math.round(world.size / 100) / 10 + " MB"
      });
   });

   // Toggle description buttons
   toggleDesc();

   // Get seach box
   var searchBox = document.getElementById("FWsearchbox")

   // Focus search box
   searchBox.focus();

   // Hide section if no results on update
   worldsList.on("updated", async () => {
      const resultsbox = document.getElementById("FWresults");
      !resultsbox.hasChildNodes() ? resultsbox.style.display = "none" : resultsbox.style.display = "block";
   });
};

// Toggle decriptions
function toggleDesc() {

   const symbols = ["+", "−"]; // Set icons

   document.querySelectorAll("#FWtoggle").forEach(toggle => { // Get the toggle element
      const details = toggle.nextElementSibling; // Get the details element
      const symbol = toggle.lastElementChild; // Get the toggle symbol element

      details.style.display = "none"; // Set to initially hide details
      symbol.innerText = symbols[0]; // Set to initially show plus symbol

      // Handle click
      toggle.addEventListener("click", event => {

         // If it's not an install button, toggle
         if (!event.target.id.startsWith("FWinstall")) {
            if (details.style.display != "flex") {

               // Show details
               details.style.display = "flex";

               // Change icon
               symbol.innerText = symbols[1];

            } else {

               // Hide details
               details.style.display = "none";

               // Change icon
               symbol.innerText = symbols[0];
            };
         };
      });
   });
};

// Handle scrolling
function scrollFunction() {
   if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      gotoBtn.style.display = "block";
   } else {
      gotoBtn.style.display = "none";
   };
};

// Handle goto top button
function topFunction() {
   document.body.scrollTop = 0;
   document.documentElement.scrollTop = 0;
};
