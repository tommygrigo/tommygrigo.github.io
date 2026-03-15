async function loadPage(page) {

  const response = await fetch(`pages/${page}.html`);
  const html = await response.text();

   document.getElementById("content").innerHTML = html;

   if(page === "publications"){
    loadPublications();
   }

   // scroll to top
  window.scrollTo(0,0);
}

async function loadPublications() {
  const apiUrl = "https://tommygrigo.github.io/publications.xml";
    fetchXMLData(apiUrl)
        .then(xmlDoc => displayEntries(xmlDoc))
        .catch(error => console.error("Error fetching XML data:", error));
}

// load default page
window.onload = () => loadPage("about");

// Function to fetch XML data from the provided URL
async function fetchXMLData(url) {
    return fetch(url)
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        return xmlDoc;
    });
}

// Function to extract and display the title, author, and uploading year of each entry
async function displayEntries(xmlDoc) {
    const entries = xmlDoc.querySelectorAll("entry");
    const paperListUl = document.getElementById("paperlist");

    entries.forEach(entry => {
    const title = entry.querySelector("title").textContent;
    const link = entry.querySelector("id").textContent;
    const authors = Array.from(entry.querySelectorAll("author")).map(author => author.textContent).join(", ");
    const uploadingDate = entry.querySelector("published").textContent;
    const uploadingYear = new Date(uploadingDate).getFullYear();
    
    const journalNode = entry.querySelector("arxiv\\:journal_ref, journal_ref");
    const journal = journalNode ? journalNode.textContent : uploadingYear;
    const doiLinkNode = entry.querySelector("link[title='doi']");
    const journalLink = doiLinkNode ? doiLinkNode.getAttribute("href") : null;

    const paperLi = document.createElement("li");

    paperLi.classList.add("paper");
    var str="<strong>"+title +"</strong><br>"+authors +", <i>"+journal +"</i>. ";
    if (journalLink) {    
      str+="<a href='"+journalLink+"'>[online]</a>"
    }
    str=str+ " <a href='"+link+"'>[arxiv]</a>";
    paperLi.innerHTML = str;
        
    paperListUl.appendChild(paperLi);

    });


}

//URL TO DOWNLOAD XML FROM "https://export.arxiv.org/api/query?search_query=au:%22tommaso+grigoletto%22&start=0&max_results=2000&sortBy=submittedDate";

