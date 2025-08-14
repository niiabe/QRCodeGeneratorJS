let qrCode;
let liveLogoImage = null;

function updateQRCode() {
  const text = document.getElementById("qrText").value.trim();
  const size = parseInt(document.getElementById("qrSize").value);
  const dotStyle = document.getElementById("dotStyle").value;
  const colorStart = document.getElementById("colorStart").value;
  const colorEnd = document.getElementById("colorEnd").value;
  const logoSize = parseFloat(document.getElementById("logoSize").value);

  if (!text) return;

  const qrOptions = {
    width: size,
    height: size,
    data: text,
    image: liveLogoImage || undefined,
    imageOptions: {
      crossOrigin: "anonymous",
      imageSize: logoSize,
      hideBackgroundDots: false,
      margin: 0,
      imageBackgroundShape: "circle"
    },
    dotsOptions: {
      type: dotStyle,
      gradient: {
        type: "linear",
        rotation: 0,
        colorStops: [
          { offset: 0, color: colorStart },
          { offset: 1, color: colorEnd }
        ]
      }
    },
    backgroundOptions: {
      color: "#ffffff"
    }
  };

  document.getElementById("qrContainer").innerHTML = "";
  qrCode = new QRCodeStyling(qrOptions);
  qrCode.append(document.getElementById("qrContainer"));
}

// Event listeners for instant updates
["dotStyle", "qrSize", "colorStart", "colorEnd", "logoSize"].forEach(id => {
  document.getElementById(id).addEventListener("change", updateQRCode);
});
document.getElementById("qrText").addEventListener("input", updateQRCode);

document.getElementById("downloadBtn").addEventListener("click", () => {
  if (!qrCode) {
    alert("Generate the QR code first.");
    return;
  }
  qrCode.download({ name: "styled-qr", extension: "png" });
});

// Logo preview + embed live
document.getElementById("logoUpload").addEventListener("change", function () {
  const file = this.files[0];
  const preview = document.getElementById("logoPreview");

  if (!file || !file.type.startsWith("image/")) {
    preview.innerHTML = "";
    liveLogoImage = null;
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Logo too large (max 5MB)");
    this.value = "";
    preview.innerHTML = "";
    liveLogoImage = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = document.createElement("img");
    img.src = e.target.result;
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    img.style.objectFit = "contain";

    preview.innerHTML = "";
    preview.appendChild(img);
    liveLogoImage = e.target.result;
    updateQRCode();
  };
  reader.readAsDataURL(file);
});

// Reset logo
document.getElementById("resetLogo").addEventListener("click", () => {
  document.getElementById("logoUpload").value = "";
  document.getElementById("logoPreview").innerHTML = "";
  liveLogoImage = null;
  updateQRCode();
});

// Initial QR code generation on page load
document.addEventListener("DOMContentLoaded", updateQRCode);
