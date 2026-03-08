let issuesStore = [];

// Priority badge
const makePriorityTag = (level) => {
  const priorityLevel = level.toUpperCase();

  return `
  <span class="w-20 text-center px-3 py-2 text-sm rounded-md font-semibold
  ${
    priorityLevel === "HIGH"
      ? "bg-red-100 text-red-600"
      : priorityLevel === "MEDIUM"
      ? "bg-yellow-100 text-yellow-600"
      : priorityLevel === "LOW"
      ? "bg-gray-100 text-gray-600"
      : "bg-green-100 text-green-600"
  }">
  ${priorityLevel}
  </span>
  `;
};


// Labels
const generateLabelTags = (tagList) => {
  return tagList
    .map((tag) => {
      const labelName = tag.toLowerCase();

      if (labelName === "bug")
        return `<span class="px-3 py-1 text-xs rounded-full border border-red-400 text-red-500 hover:bg-red-100 transition">🐞 BUG</span>`;

      if (labelName === "help wanted")
        return `<span class="px-3 py-1 text-xs rounded-full border border-yellow-400 text-yellow-600 hover:bg-yellow-100 transition">⚙️ HELP WANTED</span>`;

      if (labelName === "enhancement")
        return `<span class="px-3 py-1 text-xs rounded-full border border-green-400 text-green-600 hover:bg-green-100 transition">✨ ENHANCEMENT</span>`;

      if (labelName === "good first issue")
        return `<span class="px-3 py-1 text-xs rounded-full border border-blue-400 text-blue-600 hover:bg-blue-100 transition">🚀 GOOD FIRST ISSUE</span>`;

      if (labelName === "documentation")
        return `<span class="px-3 py-1 text-xs rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 transition">📄 DOCUMENTATION</span>`;
    })
    .join(" ");
};


// LOGIN
document.getElementById("signin-btn").addEventListener("click", () => {

  const userField = document.getElementById("user-field").value;
  const passField = document.getElementById("pass-field").value;

  if (userField === "admin" && passField === "admin123") {

    document.getElementById("signin-area").classList.add("hidden");

    document.querySelector("header").classList.remove("hidden");
    document.getElementById("filter-section").classList.remove("hidden");
    document.getElementById("stats-section").classList.remove("hidden");
    document.getElementById("cards-section").classList.remove("hidden");

    fetchIssues();

  } else {
    alert("Wrong Username or Password");
  }

});


// SEARCH
const findIssues = () => {

  const searchText = document.getElementById("search-box").value;

  toggleLoader(true);

  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`)
    .then(res => res.json())
    .then(data => {

      issuesStore = data.data;

      renderIssueCards(issuesStore);
      updateIssueCounter(issuesStore);

      toggleLoader(false);

    });
};


document.getElementById("search-action").addEventListener("click", () => {
  findIssues();
});



// LOAD ISSUES
const fetchIssues = () => {

  toggleLoader(true);

  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then(res => res.json())
    .then(data => {

      issuesStore = data.data;

      renderIssueCards(issuesStore);
      updateIssueCounter(issuesStore);

      toggleLoader(false);

    });

};


// ISSUE DETAILS
const fetchIssueDetails = (issueID) => {

  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueID}`)
    .then(res => res.json())
    .then(data => {
      openIssueModal(data.data);
    });

};


// SPINNER
const toggleLoader = (state) => {

  if (state) {

    document.getElementById("loader-box").classList.remove("hidden");
    document.getElementById("cards-section").classList.add("hidden");

  } else {

    document.getElementById("loader-box").classList.add("hidden");
    document.getElementById("cards-section").classList.remove("hidden");

  }

};


// DISPLAY CARDS
const renderIssueCards = (issues) => {

  const cardWrapper = document.getElementById("card-wrapper");

  cardWrapper.innerHTML = "";

  issues.forEach((issue) => {

    const statusBorder =
      issue.status.toLowerCase() === "open"
        ? "border-t-4 border-green-400"
        : "border-t-4 border-purple-400";

    const created = issue.createdAt.split("T")[0];
    const updated = issue.updatedAt.split("T")[0];

    const card = document.createElement("div");

    card.onclick = () => fetchIssueDetails(issue.id);

    card.className = `issue-card card shadow-md p-5 rounded-xl bg-gray-100 hover:shadow-xl hover:-translate-y-2 transition duration-300 cursor-pointer ${statusBorder}`;

    card.innerHTML = `

<div class="flex justify-between mb-2">
<img class="w-8" src="./assets/Open-Status.png">
${makePriorityTag(issue.priority)}
</div>

<h2 class="font-semibold text-lg">
${issue.title}
</h2>

<p class="text-sm text-gray-500">
${issue.description}
</p>

<div class="flex flex-wrap gap-2 mt-2">
${generateLabelTags(issue.labels)}
</div>

<div class="border-t border-gray-300 my-2"></div>

<div class="text-sm text-gray-500 flex justify-between">
<p>#${issue.id} ${issue.author}</p>
<p>${created}</p>
</div>

<div class="text-sm text-gray-500 flex justify-between">
<p>Assignee: ${issue.assignee ? issue.assignee : "Not Assigned"}</p>
<p>Updated: ${updated}</p>
</div>

`;

    cardWrapper.append(card);

  });

};


// MODAL
const openIssueModal = (issue) => {

  const modalBody = document.getElementById("modal-body");

  modalBody.innerHTML = `

<h2 class="text-xl font-bold">${issue.title}</h2>

<div class="flex items-center gap-2 text-sm">
<span class="badge badge-success">${issue.status}</span>
<span>Opened by ${issue.author}</span>
</div>

<div class="flex flex-wrap gap-2 mt-2">
${generateLabelTags(issue.labels)}
</div>

<p class="text-sm text-gray-500 mt-2">
${issue.description}
</p>

<div class="flex justify-center p-4 rounded-md bg-gray-200 w-full mt-4">

<div class="w-1/2 flex flex-col space-y-2">
<p class="text-gray-400">Assignee:</p>
<p class="font-semibold">
${issue.assignee ? issue.assignee : "Not"}
</p>
</div>

<div class="text-right flex flex-col items-center w-20">
<p class="text-gray-400 mb-1">Priority:</p>
${makePriorityTag(issue.priority)}
</div>

</div>

`;

  document.getElementById("issue_modal").showModal();

};


// ISSUE COUNT
const updateIssueCounter = (issues) => {
  document.getElementById("issue-total").innerText = `${issues.length} Issues`;
};


// FILTER BUTTONS
document.querySelectorAll("#filter-section button").forEach((button) => {

  button.addEventListener("click", () => {

    toggleLoader(true);

    setTimeout(() => {

      const filterType = button.innerText.toLowerCase();

      if (filterType === "all") {

        renderIssueCards(issuesStore);
        updateIssueCounter(issuesStore);

      } else if (filterType === "open") {

        const openList = issuesStore.filter(issue => issue.status.toLowerCase() === "open");

        renderIssueCards(openList);
        updateIssueCounter(openList);

      } else if (filterType === "closed") {

        const closeList = issuesStore.filter(issue => issue.status.toLowerCase() === "closed");

        renderIssueCards(closeList);
        updateIssueCounter(closeList);

      }

      document.querySelectorAll("#filter-section button").forEach(btn => {

        btn.classList.remove("btn-primary");
        btn.classList.add("btn-neutral");

      });

      button.classList.remove("btn-neutral");
      button.classList.add("btn-primary");

      toggleLoader(false);

    }, 120);

  });

});