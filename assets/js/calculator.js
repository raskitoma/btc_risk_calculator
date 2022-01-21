var BTCValue = 100000;
var BTCCrashValue = 50000;
var BTCReboundValue = 100000;
var MyBTC = 1;
var MyAssets = MyBTC * BTCValue;
var LoanTier = "tier_3";
var useCEL = false;
var useCELLoan = false;
var priceRate = 1000;
var expectedEarn = 0;
var tableData = [];
var table = null;
var btnDisableTime = 10000;
var crashPCT = 0.5;
var reboundPCT = 1.5;
var tiers = {
	"tier_1": {
		"title": "LTB Ratio 4:1",
		"value": 25000,
		"pct_coll": 0.25,
		"pct_loan": 0.01
	},
	"tier_2": {
		"title": "LTB Ratio 3:1",
		"value": 33000,
		"pct_coll": 0.33,
		"pct_loan": 0.0695
	},
	"tier_3": {
		"title": "LTB Ratio 2:1",
		"value": 50000,
		"pct_coll": 0.50,
		"pct_loan": 0.0850
	}
};
var loan_pct = {
	"BTC": {
		"CEL": 0.0383,
		"BTC": 0.0305
	},
	"USDC": {
		"CEL": 0.1073,
		"BTC": 0.0850
	}
};

$('#RefreshBTC').on('click', function(){
	RefreshBTCData();
});

$('#calculate').on('click', function() {
	console.log('ouch');
	ExpectBTC();
});

$('#LoanTier').on('change', function() {
	ExpectBTC();
});

$('#useCEL').on('click', function() {
	if (!useCEL) {
		useCEL = true;
	} else {
		useCEL = false;
	}
	ExpectBTC();
});

$('#useCELLoan').on('click', function() {
	if (!useCELLoan) {
		useCELLoan = true;
	} else {
		useCELLoan = false;
	}
	ExpectBTC();
});

$('#generateTable').on('click', function() {
	var table = $('#tblBreakPoint').DataTable( {
        data: tableData,
        columns: [
            { title: "Crashed BTC" },
            { title: "Rebounded BTC" },
            { title: "Earned BTC" },
            { title: "Earned USD" },
			{ title: "BreakPoint" },
        ],
		"paging": true,
		"searching": true,
		"pagingType": "full_numbers",
		"order" : [
			[0, "desc"],
			[1, "asc"]
		]
    } );
});

function ExpectBTC() {
	if ((BTCCrashValue > BTCValue) || (BTCReboundValue < BTCCrashValue)) {
		return;
	}
	console.log('Calculating...');
	if(useCEL) {
		$('#useCEL').addClass('btn-primary');
		$('#useCEL').removeClass('btn-default');
	} else {
		$('#useCEL').addClass('btn-default');
		$('#useCEL').removeClass('btn-primary');
	}
	if(useCELLoan) {
		$('#useCELLoan').addClass('btn-primary');
		$('#useCELLoan').removeClass('btn-default');
	} else {
		$('#useCELLoan').addClass('btn-default');
		$('#useCELLoan').removeClass('btn-primary');
	}
	var MyAssets = MyBTC * BTCValue;
	var collateralUSD = tiers[LoanTier].value/tiers[LoanTier].pct_coll;
	var collateralBTC = collateralUSD/BTCValue;
	var loanCost = tiers[LoanTier].value*tiers[LoanTier].pct_loan;
	loanCost = useCELLoan ? loanCost * 0.75 : loanCost;
	var loaninterest = tiers[LoanTier].value * loan_pct["USDC"][useCEL ? "CEL" : "BTC"];
	var loanTotal = loaninterest - loanCost;
	$('#MyRate').val('USD = ' + loan_pct["USDC"][useCEL ? "CEL" : "BTC"] * 100 + "%, BTC = " + loan_pct["BTC"][useCEL ? "CEL" : "BTC"] * 100 + "%");
	$('#MyOffer').val(useCELLoan ? "25% Discount" : "No Discount");
	$('#tier_details').val("Loan: " + tiers[LoanTier].value + " USD" + "\n" + (tiers[LoanTier].pct_coll).toFixed(2) * 100 + "% Collateral($" + collateralUSD.toFixed(2) + "/" + collateralBTC.toFixed(6) + "BTC)\n" + (tiers[LoanTier].pct_loan * 100).toFixed(2) + "% Loan");
	$("#MyAssets").val(MyAssets.toFixed(2));
	$('#LoanInterest').val(loaninterest.toFixed(2));
	$('#LoanCost').val(loanCost.toFixed(2));
	$('#LoanTotalUSD').val(loanTotal.toFixed(2));

	var percInterest = ( MyBTC - collateralBTC ) * loan_pct["BTC"][useCEL ? "CEL" : "BTC"];
	var lostInterest = collateralBTC * loan_pct["BTC"][useCEL ? "CEL" : "BTC"];
	var totalInterestBTC = percInterest - lostInterest;
	$('#percInterest').val(percInterest.toFixed(6));
	$('#lostInterest').val(lostInterest.toFixed(6));
	$('#totalInterestBTC').val(totalInterestBTC.toFixed(6));

	var grandTotalBTC = totalInterestBTC + loanTotal / BTCValue;
	var grandTotalUSD = grandTotalBTC * BTCValue;
	$('#grandTotalBTC').val(grandTotalBTC.toFixed(6));
	$('#grandTotalUSD').val(grandTotalUSD.toFixed(2));
	if (grandTotalBTC < 0 ) {
		$('#grandTotalBTC').removeClass("bg-success");
		$('#grandTotalBTC').removeClass("bg-light");
		$('#grandTotalBTC').addClass("bg-danger");
		$ ('#grandTotalBTC').addClass("text-white");
		$ ('#grandTotalBTC').removeClass("text-dark");
	} else if (grandTotalBTC = 0) {
		$('#grandTotalBTC').removeClass("bg-danger");
		$('#grandTotalBTC').removeClass("bg-success");
		$('#grandTotalBTC').addClass("bg-light");
		$ ('#grandTotalBTC').addClass("text-dark");
		$ ('#grandTotalBTC').removeClass("text-white");
	} else {
		$('#grandTotalBTC').removeClass("bg-danger");
		$('#grandTotalBTC').removeClass("bg-light");
		$('#grandTotalBTC').addClass("bg-success");
		$ ('#grandTotalBTC').addClass("text-white");
		$ ('#grandTotalBTC').removeClass("text-dark");
	}
	if (grandTotalUSD < 0 ) {
		$('#grandTotalUSD').removeClass("bg-success");
		$('#grandTotalUSD').removeClass("bg-light");
		$('#grandTotalUSD').addClass("bg-danger");
		$ ('#grandTotalUSD').addClass("text-white");
		$ ('#grandTotalUSD').removeClass("text-dark");
	} else if (grandTotalUSD = 0) {
		$('#grandTotalUSD').removeClass("bg-danger");
		$('#grandTotalUSD').removeClass("bg-success");
		$('#grandTotalUSD').addClass("bg-light");
		$ ('#grandTotalUSD').addClass("text-dark");
		$ ('#grandTotalUSD').removeClass("text-white");
	} else {
		$('#grandTotalUSD').removeClass("bg-danger");
		$('#grandTotalUSD').removeClass("bg-light");
		$('#grandTotalUSD').addClass("bg-success");
		$ ('#grandTotalUSD').addClass("text-white");
		$ ('#grandTotalUSD').removeClass("text-dark");
	}

	var grandParkedBTC = MyBTC * loan_pct["BTC"][useCEL ? "CEL" : "BTC"];
	var grandParkedUSD = grandParkedBTC * BTCReboundValue;
	$('#grandParkedBTC').val(grandParkedBTC.toFixed(6));
	$('#grandParkedUSD').val(grandParkedUSD.toFixed(2));
	if (grandParkedBTC < 0 ) {
		$('#grandParkedBTC').removeClass("bg-success");
		$('#grandParkedBTC').removeClass("bg-light");
		$('#grandParkedBTC').addClass("bg-danger");
		$ ('#grandParkedBTC').addClass("text-white");
		$ ('#grandParkedBTC').removeClass("text-dark");
	} else if (grandParkedBTC = 0) {
		$('#grandParkedBTC').removeClass("bg-danger");
		$('#grandParkedBTC').removeClass("bg-success");
		$('#grandParkedBTC').addClass("bg-light");
		$ ('#grandParkedBTC').addClass("text-dark");
		$ ('#grandParkedBTC').removeClass("text-white");
	} else {
		$('#grandParkedBTC').removeClass("bg-danger");
		$('#grandParkedBTC').removeClass("bg-light");
		$('#grandParkedBTC').addClass("bg-success");
		$ ('#grandParkedBTC').addClass("text-white");
		$ ('#grandParkedBTC').removeClass("text-dark");
	}
	if (grandParkedUSD < 0 ) {
		$('#grandParkedUSD').removeClass("bg-success");
		$('#grandParkedUSD').removeClass("bg-light");
		$('#grandParkedUSD').addClass("bg-danger");
		$ ('#grandParkedUSD').addClass("text-white");
		$ ('#grandParkedUSD').removeClass("text-dark");
	} else if (grandParkedUSD = 0) {
		$('#grandParkedUSD').removeClass("bg-danger");
		$('#grandParkedUSD').removeClass("bg-success");
		$('#grandParkedUSD').addClass("bg-light");
		$ ('#grandParkedUSD').addClass("text-dark");
		$ ('#grandParkedUSD').removeClass("text-white");
	} else {
		$('#grandParkedUSD').removeClass("bg-danger");
		$('#grandParkedUSD').removeClass("bg-light");
		$('#grandParkedUSD').addClass("bg-success");
		$ ('#grandParkedUSD').addClass("text-white");
		$ ('#grandParkedUSD').removeClass("text-dark");
	}

	// Calculate rate

	tableData = [];
	var crashedBTC = BTCValue;

	while ( crashedBTC >= BTCCrashValue ) {
		// calculate earnings from crashed point up to rebound point
		var reboundedBTC = crashedBTC;
		foundBreak = false;
		while ( reboundedBTC <= BTCReboundValue ) {
			// calculate earning on rebounded point
			// var MyAssets = MyBTC * crashedBTC;
			var collateralUSD = tiers[LoanTier].value; // /tiers[LoanTier].pct_coll;
			var collateralBTC = collateralUSD/reboundedBTC;
			var loanCost = tiers[LoanTier].value*tiers[LoanTier].pct_loan;
			loanCost = useCELLoan ? loanCost * 0.75 : loanCost;
			var loaninterest = tiers[LoanTier].value * loan_pct["USDC"][useCEL ? "CEL" : "BTC"];
			var loanTotal = loaninterest - loanCost;	
			var percInterest = ( MyBTC - collateralBTC ) * loan_pct["BTC"][useCEL ? "CEL" : "BTC"];
			var lostInterest = collateralBTC * loan_pct["BTC"][useCEL ? "CEL" : "BTC"];
			var totalInterestBTC = percInterest - lostInterest;
		
			var boughtBTCwithLoan = tiers[LoanTier].value / crashedBTC;

			var loanTotalBTC = loanTotal / reboundedBTC;

			// perdida vs falta de ganar aumentar

			var grandTotalBTC = totalInterestBTC + boughtBTCwithLoan + loanTotalBTC - collateralBTC;
			var grandTotalUSD = grandTotalBTC * reboundedBTC;

			console.log('----');
			console.log('crashedBTC: ' + crashedBTC + ' reboundedBTC: ' + reboundedBTC);
			console.log('collateralUSD: ' + collateralUSD, 'collateralBTC: ' + collateralBTC);
			console.log('loanCost: ' + loanCost, 'loaninterest: ' + loaninterest, 'loanTotal: ' + loanTotal);
			console.log('loanTotalBTC: ' + loanTotalBTC);
			console.log('percInterest: ' + percInterest, 'lostInterest: ' + lostInterest, 'totalInterestBTC: ' + totalInterestBTC);
			console.log('boughtBTCwithLoan: ' + boughtBTCwithLoan);
			console.log('grandTotalBTC: ' + grandTotalBTC, 'grandTotalUSD: ' + grandTotalUSD);

			if (grandTotalBTC >= 0 ) {
				if(!foundBreak) {
					breakPoint = "Cha-ching";
					foundBreak = true;
				} else {
					breakPoint = "Check";
				}

				var item_table = [
					crashedBTC,
					reboundedBTC,
					grandTotalBTC.toFixed(6),
					grandTotalUSD.toFixed(2),
					breakPoint
				];
				tableData.push(item_table);
			}

			reboundedBTC += priceRate;
		}
		crashedBTC -= priceRate;
	}

	console.table(tableData);

	$('html', 'body').animate({
		scrollTop: $("#dataTableBTN").offset().top
	}, 1000);
}

function EnableBTN() {
	$('#calculate').removeAttr('disabled');
	$('#LoanTier').removeAttr('disabled');
	$('#useCEL').removeAttr('disabled');
	$('#useCELLoan').removeAttr('disabled');
}

function RefreshBTCData() {
	// Get current BTC value
	var XHR = new XMLHttpRequest();
	XHR.onreadystatechange = function(){
		if(XHR.readyState == 4 && XHR.status == 200){
			var data = JSON.parse(XHR.responseText);
			BTCValue = parseFloat(data.bpi.USD.rate_float);
			BTCCrashValue = parseFloat(BTCValue) * crashPCT;
			BTCReboundValue = parseFloat(BTCValue) * reboundPCT;
			$('#BTCValue').val(BTCValue.toFixed(2));
			$('#BTCCrashValue').val(BTCCrashValue.toFixed(2));
			$('#BTCReboundValue').val(BTCReboundValue.toFixed(2));
			ExpectBTC();
			EnableBTN();
		}
	};
	XHR.open("GET", "https://api.coindesk.com/v1/bpi/currentprice.json");
	XHR.send();
	
	// Disable button for x seconds
	$('#RefreshBTC').attr('disabled', 'disabled');
	setTimeout(function(){
		$('#RefreshBTC').removeAttr('disabled');
	}, btnDisableTime);

}

$(document).ready(function() {
	RefreshBTCData();
});
