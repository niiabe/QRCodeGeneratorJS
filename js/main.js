let qrCode;

document.getElementById("generateBtn").addEventListener("click", () => {
  const text = document.getElementById("qrText").value.trim();
  const size = parseInt(document.getElementById("qrSize").value);
  const dotStyle = document.getElementById("dotStyle").value;
  const colorStart = document.getElementById("colorStart").value;
  const colorEnd = document.getElementById("colorEnd").value;
  const logoFile = document.getElementById("logoUpload").files[0];
  const logoSize = parseFloat(document.getElementById("logoSize").value);

  if (!text) {
    alert("Please enter some text or a URL.");
    return;
  }

  const qrOptions = {
    width: size,
    height: size,
    data: text,
    imageOptions: {
      crossOrigin: "anonymous",
      imageSize: logoSize
    },
    dotsOptions: {
      gradient: {
        type: "linear",
        rotation: 0,
        colorStops: [
          { offset: 0, color: colorStart },
          { offset: 1, color: colorEnd }
        ]
      },
      type: dotStyle
    },
    backgroundOptions: {
      color: "#ffffff"
    }
  };

  if (logoFile) {
    if (logoFile.size > 5 * 1024 * 1024) {
      alert("Logo file is too large (max 5MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      qrOptions.image = reader.result;
      qrOptions.imageOptions.hideBackgroundDots = false;
      qrOptions.imageOptions.margin = 0;
      qrOptions.imageOptions.imageSize = logoSize;
      qrOptions.imageOptions.imageBackgroundShape = "circle"; // << Rounded mask

      generateStyledQRCode(qrOptions);
    };
    reader.readAsDataURL(logoFile);
  } else {
    generateStyledQRCode(qrOptions);
  }
});

function generateStyledQRCode(options) {
  document.getElementById("qrContainer").innerHTML = "";
  qrCode = new QRCodeStyling(options);
  qrCode.append(document.getElementById("qrContainer"));
}

document.getElementById("downloadBtn").addEventListener("click", () => {
  if (!qrCode) {
    alert("Please generate a QR code first.");
    return;
  }
  qrCode.download({ name: "styled-qr", extension: "png" });
});
