var tiers = {
	"tier_1": {
		"title": "Tier 1",
		"value": 25000,
		"pct_coll": 0.25,
		"pct_loan": 0.01
	},
	"tier_2": {
		"title": "Tier 2",
		"value": 33000,
		"pct_coll": 0.33,
		"pct_loan": 0.0695
	},
	"tier_3": {
		"title": "Tier 3",
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

var BTCValue = 50000;
var MyBTC = 1;
var MyAssets = MyBTC * BTCValue;
var LoanTier = "tier_1";
var useCEL = false;
var useCELLoan = false;

$("#BTCValue").on("input", function() {
	BTCValue = $(this).val();
	ExpectBTC();
});

$('#MyBTC').on('input', function() {
	MyBTC = $(this).val();
	ExpectBTC();
});

$('#LoanTier').on('change', function() {
	LoanTier = this.value;
	ExpectBTC();
});

$('#useCEL').on('change', function() {
	useCEL = $(this).is(":checked");
	ExpectBTC();
});

$('#useCELLoan').on('change', function() {
	useCELLoan = $(this).is(":checked");
	ExpectBTC();
});

function ExpectBTC() {
	var MyAssets = MyBTC * BTCValue;
	var collateralUSD = tiers[LoanTier].value/tiers[LoanTier].pct_coll;
	var collateralBTC = collateralUSD/BTCValue;
	console.log(collateralUSD, collateralBTC);
	var loanCost = tiers[LoanTier].value*tiers[LoanTier].pct_loan;
	loanCost = useCELLoan ? loanCost * 0.75 : loanCost;
	var loaninterest = tiers[LoanTier].value * loan_pct["USDC"][useCEL ? "CEL" : "BTC"];
	var loanTotal = loaninterest - loanCost;
	$('#MyRate').html('USD = ' + loan_pct["USDC"][useCEL ? "CEL" : "BTC"] * 100 + "%, BTC = " + loan_pct["BTC"][useCEL ? "CEL" : "BTC"] * 100 + "%");
	$('#MyOffer').html(useCELLoan ? "25% Discount" : "No Discount");
	$('#tier_details').html(tiers[LoanTier].title + ": " + tiers[LoanTier].value + " USD" + "<br/>" + (tiers[LoanTier].pct_coll).toFixed(2) * 100 + "% Collateral" + "<br/>" + (tiers[LoanTier].pct_loan * 100).toFixed(2) + "% Loan");
	$("#MyAssets").val(MyAssets.toFixed(2));
	$('#LoanInterest').val(loaninterest.toFixed(2));
	$('#LoanCost').val(loanCost.toFixed(2));
	$('#LoanTotalUSD').val(loanTotal.toFixed(2));

	var percInterest = ( MyBTC - collateralBTC ) * loan_pct["BTC"][useCEL ? "CEL" : "BTC"];
	var lostInterest = collateralBTC * loan_pct["BTC"][useCEL ? "CEL" : "BTC"];
	var totalInterestBTC = percInterest - lostInterest;
	console.log(percInterest, lostInterest, totalInterestBTC);
	$('#percInterest').val(percInterest.toFixed(6));
	$('#lostInterest').val(lostInterest.toFixed(6));
	$('#totalInterestBTC').val(totalInterestBTC.toFixed(6));



	var grandTotalBTC = totalInterestBTC + loanTotal / BTCValue;
	$('#grandTotalBTC').val(grandTotalBTC.toFixed(6));


	
}

$(document).ready(function() {
	ExpectBTC();
}
);
