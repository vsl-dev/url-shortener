const baseURL = "http://localhost:3500";
const urlP = document.getElementById("urlP");
const urlID = document.getElementById("urlID");
const urlDate = document.getElementById("urlDate");
const urlRedirect = document.getElementById("urlRedirect");
const urlType = document.getElementById("urlType");
const clicks = document.getElementById("clicks");
const clicksB = document.getElementById("clicksB");
const urlDateB = document.getElementById("urlDateB");
const elems = document.querySelectorAll("[loader]");

const formatter = Intl.NumberFormat("en", { notation: "compact" });

urlInfo = () => {
  const url = new URL(window.location.href);
  const pathname = url.pathname;

  elems.forEach((element) => {
    element.textContent = "Loading...";
  });

  fetch(`/api/info/${pathname.replaceAll("/", " ").split(" ")[2]}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      const url = data.data;
      console.log(data);
      if (data.code === 404)
        return swal({
          title: "Error!",
          text: "Error: " + data.message,
          icon: "error",
          closeOnClickOutside: false,
        }).then((closeModal) => {
          window.location.href = "/";
        });
      if (data.code === 500)
        return swal("Error!", "Error: " + data.message, "error");
      if (data.code === 200) {
        urlP.textContent = baseURL + "/" + url.id;
        urlID.textContent = url.id;
        urlDate.textContent = moment(url.added).from();
        urlDateB.textContent = `(${moment(url.added).format("DD/MM/YYYY")})`;
        urlRedirect.textContent = url.url;
        urlType.textContent = url.type <= 0 ? "Random" : "Custom";
        clicks.textContent = formatter.format(url.stats.clicks) ?? 0;
        clicksB.textContent = `(${url.stats.clicks ?? 0})`;
        clicks.onmouseover = () => {
          clicksB.classList.toggle("hidden");
        };
        clicks.onmouseout = () => {
          clicksB.classList.toggle("hidden");
        };
      }
    });
};

window.onload = () => {
  urlInfo();
};
