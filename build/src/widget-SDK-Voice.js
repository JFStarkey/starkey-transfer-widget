import { Desktop } from "@wxcc-desktop/sdk";

const template = document.createElement("template");

template.innerHTML = `
<style>

.container{
    padding:20px;
    font-family:'Poppins', sans-serif;
}

.title{
    font-size:22px;
    font-weight:bold;
    margin-bottom:20px;
    color:#064157;
    text-align:center;
}

.transferBtn{
    width:100%;
    height:70px;
    margin-bottom:15px;
    border:none;
    border-radius:8px;
    background:#007AA3;
    color:white;
    font-size:18px;
    font-weight:bold;
    cursor:pointer;
    transition:.3s;
}

.transferBtn:hover{
    background:#005E7D;
}

</style>

<div class="container">

    <div class="title">
        Receptionist Transfers
    </div>

    <button id="jay" class="transferBtn">
        Jay
    </button>

    <button id="billing" class="transferBtn">
        Billing
    </button>

    <button id="sales" class="transferBtn">
        Sales
    </button>

    <button id="support" class="transferBtn">
        Support
    </button>

    <button id="eptest" class="transferBtn">
        EP TEST
    </button>

</div>
`;


//Creating a custom logger
const logger = Desktop.logger.createLogger("Niko-logger");

class myDesktopSDK extends HTMLElement {
  constructor() {
    super();

    // Google font
    const font = document.createElement("link");
    font.href = "https://fonts.googleapis.com/css2?family=Cutive+Mono&family=Darker+Grotesque:wght@300&family=Poppins:wght@200;400&display=swap";
    font.rel = "stylesheet";
    document.head.appendChild(font);

    // Step 1
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.interactionId = null;
  }

  connectedCallback() {
    this.init();
    this.getAgentInfo();
  }

  disconnectedCallback() {
    // alert("remove some functions...")
    Desktop.agentContact.removeAllEventListeners();
  }

  // Sample function to print latest data of agent
  getAgentInfo() {
    const latestData = Desktop.agentStateInfo.latestData;
    logger.info("myLatestData", latestData);
  }

  // Get form input fields
  inputElement(name) {
    return this.shadowRoot.getElementById(name);
  }

  // clear inputs fields on focus

  async init() {

    Desktop.config.init();

    this.shadowRoot
        .getElementById("jay")
        .addEventListener("click", () => {

            console.log("Jay clicked");

            this.transferToDN(
                "6129683739"
            );

        });

    this.shadowRoot
        .getElementById("billing")
        .addEventListener("click", () => {

            console.log("Billing clicked");

            this.transferToDN(
                "6125551001"
            );

        });

    this.shadowRoot
        .getElementById("sales")
        .addEventListener("click", () => {

            console.log("Sales clicked");

            this.transferToDN(
                "6125551002"
            );

        });

    this.shadowRoot
        .getElementById("support")
        .addEventListener("click", () => {

            console.log("Support clicked");

            this.transferToDN(
                "6125551003"
            );

        });
      this.shadowRoot
        .getElementById("eptest")
        .addEventListener("click", () => {

            console.log("EP TEST clicked");

            this.transferToEntryPoint(
            "eb12b73c-fe53-49af-97f3-95f2fbd89246"
        );

    });

}

  // Get interactionID, but more info can be obtained from this method
  async getInteractionId() {
    const currentTaskMap = await Desktop.actions.getTaskMap();
    for (const iterator of currentTaskMap) {
      const interId = iterator[1].interactionId;
      return interId;
    }
  }


    // Transfer to DN ie Blind-Transfer
async transferToDN(phoneDN) {

    let interactionId = await this.getInteractionId();

    let response = await Desktop.agentContact.blindTransfer({
        interactionId,
        data: {
            destAgentId: phoneDN,
            mediaType: "telephony",
            destinationType: "DN"
        }
    });

    logger.info(
        "transferToDN" +
        JSON.stringify(response)
    );
}
    async transferToEntryPoint(entryPointId) {

    try {

        let interactionId =
            await this.getInteractionId();

        console.log(
            "Transfering to Entry Point:",
            entryPointId
        );

        let response =
            await Desktop.agentContact
                .blindTransfer({

                    interactionId,

                    data: {
                        destAgentId:
                            entryPointId,

                        mediaType:
                            "telephony",

                        destinationType:
                            "entrypointDialNumber"
                    }

                });

        console.log(
            "Entry Point Response",
            response
        );

    }
    catch (error) {

        console.error(
            "Entry Point Transfer Failed",
            error
        );

    }
}

}   // <-- THIS closes the class

customElements.define(
    "sa-ds-voice-sdk",
    myDesktopSDK
);
