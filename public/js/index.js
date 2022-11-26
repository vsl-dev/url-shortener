const baseURL = "http://localhost:3500";
const btn = document.getElementById("submit");
const input = document.getElementById("input");
const type = document.getElementById("type");
const form = document.getElementById("form");
const customId = document.getElementById("customId");

deleteModal = (id) => {
  swal({
    title: "Confirm",
    text: "Are you sure to delete this url?",
    icon: "warning",
    dangerMode: true,
    buttons: ["Cancel", "Delete"],
  }).then((willDelete) => {
    if (willDelete) {
      try {
        fetch("/api/delete/" + id, {
          method: "POST",
        })
          .then((response) => response.json())
          .then((data) => {
            swal("Url deleted succesfully!", {
              icon: "success",
            });
            refreshList();
          });
      } catch (err) {
        console.error(err);
        swal("Error!", "An error occurred please try again!", "error");
      }
    }
  });
};

copyUrl = (e) => {
  navigator.clipboard.writeText(e);
  swal("Success!", "Url copied to clipboard!", "success");
};

refreshList = () => {
  var div = document.createElement("div");
  var p = document.createElement("p");
  var element = document.getElementById("list");
  div.classList.add("flex", "justify-center", "items-center");
  p.classList.add(
    "text-2xl",
    "text-white",
    "fa-solid",
    "fa-spinner",
    "fa-spin"
  );
  p.setAttribute("id", "loader");
  div.appendChild(p);
  element.appendChild(div);

  try {
    fetch("/api/mylinks", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        var array = data.data;
        if (array == "") {
          document.getElementById("list").innerHTML = "";
          const a = document.createElement("p");
          const aText = document.createTextNode(
            "You don't have any shortened links"
          );
          a.classList.add("text-white");
          a.appendChild(aText);

          const element = document.getElementById("list");
          element.appendChild(a);
        } else {
          document.getElementById("list").innerHTML = "";
          array.reverse().map((x) => {
            const a = document.createElement("div");
            const b = document.createElement("div");
            const icon = document.createElement("div");
            const trash = document.createElement("div");
            const copy = document.createElement("div");
            const bText = document.createTextNode(x.url);
            a.classList.add(
              "flex",
              "flex-row",
              "justify-between",
              "items-center",
              "text-green-300",
              "p-px",
              "gap-2",
              "mt-1"
            );
            b.classList.add(
              "text-white",
              "border-2",
              "border-white",
              "p-1",
              "rounded",
              "w-full",
              "break-all"
            );
            icon.classList.add(
              "fa-solid",
              "fa-pen",
              "text-gray-800",
              "bg-white",
              "p-2.5",
              "rounded-lg",
              "cursor-pointer"
            );
            trash.classList.add(
              "fa-solid",
              "fa-trash",
              "text-gray-800",
              "bg-white",
              "p-2.5",
              "rounded-lg",
              "cursor-pointer"
            );
            copy.classList.add(
              "fa-solid",
              "fa-link",
              "text-gray-800",
              "bg-white",
              "p-2.5",
              "rounded-lg",
              "cursor-pointer"
            );
            a.appendChild(b);
            a.appendChild(icon);
            a.appendChild(trash);
            a.appendChild(copy);
            b.appendChild(bText);
            icon.setAttribute(
              "onclick",
              `window.location.href = '/info/${x.id}'`
            );
            copy.setAttribute("onclick", `copyUrl('${baseURL}/${x.id}')`);
            trash.setAttribute("onclick", `deleteModal('${x.id}')`);

            const element = document.getElementById("list");
            element.appendChild(a);
          });
        }
      });
  } catch (err) {
    console.error(err);
  }
};

type.onchange = () => {
  customId.classList.toggle("hidden");
  customId.toggleAttribute("required");
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  var json = {
    url: formData.get("url"),
    type: formData.get("type"),
    customId: formData.get("customId") ?? null,
  };

  console.log(json);

  fetch("/api/short", {
    method: "POST",
    body: JSON.stringify(json),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      refreshList();
      if (data.code === 999)
        return swal("Error!", data.message ?? ">-<", "error");
      if (data.code === 200)
        return swal("Success!", "Your url succesfuly shortened!", "success");
    });
});

window.onload = () => {
  refreshList();
};
