var request = require('request-promise');

class ZarinPal {

    #ZarinPalInfo = {
        normal: "https://www.zarinpal.com/pg/rest/WebGate/",
        sandbox: "https://sandbox.zarinpal.com/pg/rest/WebGate/",
        IDLength: 36,
        API: {
            PaymentRequest: "PaymentRequest.json",
            PaymentReqExtra: "PaymentRequestWithExtra.json",
            PaymentVerification: "PaymentVerification.json",
            PaymentVerExtra: "PaymentVerificationWithExtra.json",
            RefreshAuthority: "RefreshAuthority.json",
            UnverifiedTransactions: "UnverifiedTransactions.json"
        },
        Gates: {
            normal: "https://www.zarinpal.com/pg/StartPay/",
            sandbox: "https://sandbox.zarinpal.com/pg/StartPay/"
        },
        Errors: {
            "-1": "اطلاعات ارسال شده ناقص است.",
            "-2": "IP و يا مرچنت كد پذيرنده صحيح نيست",
			"-3": "با توجه به محدوديت هاي شاپرك امكان پرداخت با رقم درخواست شده ميسر نمي باشد",
			"-4": "سطح تاييد پذيرنده پايين تر از سطح نقره اي است.",
			"-11": "درخواست مورد نظر يافت نشد.",
			"-12": "امكان ويرايش درخواست ميسر نمي باشد.",
			"-21": "هيچ نوع عمليات مالي براي اين تراكنش يافت نشد",
			"-22": "تراكنش نا موفق ميباشد",
			"-33": "رقم تراكنش با رقم پرداخت شده مطابقت ندارد",
			"-34": "سقف تقسيم تراكنش از لحاظ تعداد يا رقم عبور نموده است",
			"-40": "اجازه دسترسي به متد مربوطه وجود ندارد.",
			"-41": "اطلاعات ارسال شده مربوط به AdditionalData غيرمعتبر ميباشد.",
			"-42": "مدت زمان معتبر طول عمر شناسه پرداخت بايد بين 30 دقيه تا 45 روز مي باشد.",
			"-54": "درخواست مورد نظر آرشيو شده است",
			"100": "عمليات با موفقيت انجام گرديده است.",
			"101": "عمليات پرداخت موفق بوده و قبلا PaymentVerification تراكنش انجام شده است.",
        },
        SendRequest: function(url, module, data, method = "POST")
        {
            if(!url || !module || !data)
                throw new Error("Funciton inputs are required.");
            if(typeof url !== 'string' || typeof module !== 'string' || typeof data !== 'object')
                throw new Error("Input types are not valid.");

            let Data2Send = {
                method: method,
                url: url + module,
                body: data,
                headers: {
                    'cache-control': 'no-cache',
			        'content-type': 'application/json'
                },
                json: true
            };

            return request(Data2Send)
        }
    }

    #URL;
    #Token;
    #SandBox;

    constructor(MerchantID, SandBox = false)
    {
        if(typeof MerchantID !== 'string' || MerchantID.length !== this.#ZarinPalInfo.IDLength)
            throw new Error("Merchant ID is Invalid.");
        if(typeof SandBox !== 'boolean')
            throw new Error("SandBox type is Invalid.");

        this.#Token = MerchantID
        this.#SandBox = SandBox;
        this.#URL = (this.#SandBox) ? this.#ZarinPalInfo.sandbox : this.#ZarinPalInfo.normal;
    }

    // Make a Payment Request
    Request(inputs)
    {
        if(!'Amount' in inputs)
            throw new Error("Amount didn't Recivied as part of Inputs.");
        
        if(!'CallbackURL' in inputs)
            throw new Error("CallbackURL didn't Recivied as part of Inputs.");

        let Data2Use = {
            MerchantID: this.#Token,
		    Amount: inputs.Amount,
		    CallbackURL: inputs.CallbackURL,
		    Description: (inputs.Description) ? inputs.Description : '',
		    Email: (inputs.Email) ? inputs.Email : '',
		    Mobile: (inputs.Phone) ? inputs.Phone : ''
        };

        return new Promise((resolve, reject) => {
            this.#ZarinPalInfo.SendRequest(this.#URL, this.#ZarinPalInfo.API.PaymentRequest, Data2Use)
            .then(APIResult => {
                resolve({
                    Status: APIResult.Status,
                    Code: APIResult.Authority,
                    URL: ((this.#SandBox) ? this.#ZarinPalInfo.Gates.sandbox : this.#ZarinPalInfo.Gates.normal) + APIResult.Authority
                });
            })
            .catch(reject);
        });
    }


    // Recive Payment Information
    Information(inputs)
    {
        if(!'Amount' in inputs)
            throw new Error("Amount didn't Recivied as part of Inputs.");
        
        if(!'Code' in inputs)
            throw new Error("Code didn't Recivied as part of Inputs.");

        let Data2Use = {
            MerchantID: this.#Token,
            Amount: inputs.Amount,
		    Authority: inputs.Code
        };

        return new Promise((resolve, reject) => {
            this.#ZarinPalInfo.SendRequest(this.#URL, this.#ZarinPalInfo.API.PaymentVerification, Data2Use)
            .then(APIResult => {
                resolve({
                    Status: APIResult.Status,
                    ID: APIResult.RefID
                });
            })
            .catch(reject);
        })
    }

    // Un-paid Payments
    FailedPayments()
    {
        let Data2Use = {
            MerchantID: this.#Token
        };

        return new Promise((resolve, reject) => {

        
            this.#ZarinPalInfo.SendRequest(this.#URL, this.#ZarinPalInfo.API.UnverifiedTransactions, Data2Use)
            .then(APIResult => {
                resolve({
                    Status: APIResult.Status,
                    Codes: APIResult.Authorities
                });
            })
            .catch(reject);
        });
    }

    EnableCode(inputs)
    {
        if(!'Code' in inputs)
            throw new Error("Code didn't Recivied as part of Inputs.");
        
        if(!'Expire' in inputs)
            throw new Error("Expire didn't Recivied as part of Inputs.");

        let Data2Use = {
            MerchantID: this.#Token,
            Authority: inputs.Code,
            ExpireIn: inputs.Expire
        };

        return new Promise((resolve, reject) => {
            this.#ZarinPalInfo.SendRequest(this.#URL, this.#ZarinPalInfo.API.RefreshAuthority, Data2Use)
            .then(APIResult => {
                resolve({
                    Status: APIResult.Status
                });
            })
            .catch(reject);
        });
    }

    GetError(StatusCode)
    {
        if(!StatusCode || typeof StatusCode !== 'number')
            throw new Error("StatusCode is invalid.");

        return this.#ZarinPalInfo.Errors[StatusCode.toString()];
    }
}

module.exports = ZarinPal;
