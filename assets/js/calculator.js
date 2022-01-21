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
	table = $('#tblBreakPoint').DataTable( {
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
		$('#useCEL').addClass('btn-primary').removeClass('btn-default');
	} else {
		$('#useCEL').addClass('btn-default').removeClass('btn-primary');
	}
	if(useCELLoan) {
		$('#useCELLoan').addClass('btn-primary').removeClass('btn-default');
	} else {
		$('#useCELLoan').addClass('btn-default').removeClass('btn-primary');
	}
	MyAssets = MyBTC * BTCValue;
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
		$('#grandTotalBTC').removeClass("bg-success bg-light text-dark").addClass("bg-danger text-white");
	} else if (grandTotalBTC == 0) {
		$('#grandTotalBTC').removeClass("bg-danger bg-success text-white").addClass("bg-light text-dark");
	} else {
		$('#grandTotalBTC').removeClass("bg-danger bg-light text-dark").addClass("bg-success text-white");
	}
	if (grandTotalUSD < 0 ) {
		$('#grandTotalUSD').removeClass("bg-success bg-light text-dark").addClass("bg-danger text-white");
	} else if (grandTotalUSD == 0) {
		$('#grandTotalUSD').removeClass("bg-danger bg-success text-white").addClass("bg-light text-dark");
	} else {
		$('#grandTotalUSD').removeClass("bg-danger bg-light text-dark").addClass("bg-success text-white");
	}

	var grandParkedBTC = MyBTC * loan_pct["BTC"][useCEL ? "CEL" : "BTC"];
	var grandParkedUSD = grandParkedBTC * BTCReboundValue;
	$('#grandParkedBTC').val(grandParkedBTC.toFixed(6));
	$('#grandParkedUSD').val(grandParkedUSD.toFixed(2));
	if (grandParkedBTC < 0 ) {
		$('#grandParkedBTC').removeClass("bg-success bg-light text-dark").addClass("bg-danger text-white");
	} else if (grandParkedBTC == 0) {
		$('#grandParkedBTC').removeClass("bg-danger bg-success text-white").addClass("bg-light text-dark");
	} else {
		$('#grandParkedBTC').removeClass("bg-danger bg-light text-dark").addClass("bg-success text-white");
	}
	if (grandParkedUSD < 0 ) {
		$('#grandParkedUSD').removeClass("bg-success bg-light text-dark").addClass("bg-danger text-white");
	} else if (grandParkedUSD == 0) {
		$('#grandParkedUSD').removeClass("bg-danger bg-success text-white").addClass("bg-light text-dark");
	} else {
		$('#grandParkedUSD').removeClass("bg-danger bg-light text-dark").addClass("bg-success text-white");
	}

	// Calculate rate

	tableData = [];
	var crashedBTC = BTCValue;

	while ( crashedBTC >= BTCCrashValue ) {
		// calculate earnings from crashed point up to rebound point
		var reboundedBTC = crashedBTC;
		var foundBreak = false;
		while ( reboundedBTC <= BTCReboundValue ) {
			// calculate earning on rebounded point
			// var MyAssets = MyBTC * crashedBTC;
			collateralUSD = tiers[LoanTier].value; // /tiers[LoanTier].pct_coll;
			collateralBTC = collateralUSD/reboundedBTC;
			loanCost = tiers[LoanTier].value*tiers[LoanTier].pct_loan;
			loanCost = useCELLoan ? loanCost * 0.75 : loanCost;
			loaninterest = tiers[LoanTier].value * loan_pct["USDC"][useCEL ? "CEL" : "BTC"];
			loanTotal = loaninterest - loanCost;	
			percInterest = ( MyBTC - collateralBTC ) * loan_pct["BTC"][useCEL ? "CEL" : "BTC"];
			lostInterest = collateralBTC * loan_pct["BTC"][useCEL ? "CEL" : "BTC"];
			totalInterestBTC = percInterest - lostInterest;
		
			var boughtBTCwithLoan = tiers[LoanTier].value / crashedBTC;

			var loanTotalBTC = loanTotal / reboundedBTC;

			// perdida vs falta de ganar aumentar

			grandTotalBTC = totalInterestBTC + boughtBTCwithLoan + loanTotalBTC - collateralBTC;
			grandTotalUSD = grandTotalBTC * reboundedBTC;

			console.log('----');
			console.log('crashedBTC: ' + crashedBTC + ' reboundedBTC: ' + reboundedBTC);
			console.log('collateralUSD: ' + collateralUSD, 'collateralBTC: ' + collateralBTC);
			console.log('loanCost: ' + loanCost, 'loaninterest: ' + loaninterest, 'loanTotal: ' + loanTotal);
			console.log('loanTotalBTC: ' + loanTotalBTC);
			console.log('percInterest: ' + percInterest, 'lostInterest: ' + lostInterest, 'totalInterestBTC: ' + totalInterestBTC);
			console.log('boughtBTCwithLoan: ' + boughtBTCwithLoan);
			console.log('grandTotalBTC: ' + grandTotalBTC, 'grandTotalUSD: ' + grandTotalUSD);

			var breakPoint = null;

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
