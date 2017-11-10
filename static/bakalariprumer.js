/*
Name: Bakalari Actions
Author: FHR; fhrnet.eu
Version: 1.1
Licence: GPL v3
*/

var lastid = 0;


function calculateWeightedAvg() {
	jQuery(".radekznamky").children("tbody").children("tr").each(function () {
		recomputeRow(this);
	});

	console.log("Recalculated averages");
}

function recomputeRow(row) {
	var prumer = jQuery(row).find('.prumer');

	var processed = processRow(row);
	var wavg = Math.round(processed.sum / processed.sumvahy * 100) / 100;
	if (isNaN(wavg)) {
		wavg = 0;
	}
	prumer.html('<span style="color:blue; font-size: 18pt;">' + wavg.toFixed(2) + '</span>');
}

function processRow(row) {
	var znamky = [];
	var vahy = [];
	var sumznamky = 0;
	var sumvahy = 0;
	var sum = 0;

	jQuery(row).find(".predm .typ").each(function () {
		jQuery(this).find("td").not(".disabled").each(function () {
			var vaha = Number(jQuery(this).text().replace(/U/g, 6).replace(/X/g, 10).replace(/R/g, 3).replace(/P/g, 4).replace(/C/g, 10));
			vahy.push(vaha);
			sumvahy += vaha;
		});

	});

	jQuery(row).find(".predm .detznamka").each(function () {
		jQuery(this).find("td").not(".disabled").each(function () {
			var znamka = Number(jQuery(this).text().replace(/X/g, 0).replace(/\?/g, 0).replace(/U/g, 0).replace(/N/g, 0).replace(/A/g, 0).replace(/1-/g, 1.5).replace(/2-/g, 2.5).replace(/3-/g, 3.5).replace(/4-/g, 4.5).replace(/-/g, 0).replace(/!$/, ''));
			znamky.push(znamka);
			sumznamky += znamka;
		});

	});

	jQuery.each(znamky, function (id, zn) {
		zn = Number(zn);
		if (zn !== 0) {
			sum += (zn * vahy[id]);
		} else {
			sumvahy -= vahy[id];
		}
	});
	return {sum: sum, sumvahy: sumvahy};
}

function checkDetailEnabled() {
	var detail = jQuery("#cphmain_Flyout2_Checktypy_S_D");
	if (detail.hasClass("dxWeb_edtCheckBoxUnchecked")) {
		detail.click();
		return false;
	} else {
		return true;
	}
}

function addznamka(element) {
	var inputs = jQuery(element).parent().parent();
	var znamka = inputs.find('.inznamka').val();
	var vaha = inputs.find('.intyp').val();

	var row = jQuery(element).closest('table').parent().parent();
	row.find('.predm .detznamka').append('<td class="modif" id="znamka_' + (lastid + 1) + '" onclick="removeZnamka(this)" style="color:darkgreen">' + znamka + "</td>");
	row.find('.predm .typ').append('<td class="modif" id="znamka_' + (lastid + 1) + '" onclick="removeZnamka(this)" style="color:darkgreen">' + vaha + "</td>");

	lastid += 1;

	recomputeRow(row);
}

function modifUI() {
	jQuery(".radekznamky").children("tbody").children("tr").each(function () {
		jQuery(this).append(
			'<td><table cellpadding="0" cellspacing="0" border="0"><tbody><tr><td>' +
			'<table cellpadding="0" cellspacing="0" border="0"><tbody>' +
			'<tr><td><input style="position:relative;width:35px;height:13px;margin:0;" class="inznamka" type="number" min="1" max="5" step="1" value="1"></td></tr>' +
			'<tr><td><input style="position:relative;width:35px;height:13px;margin:0;" class="intyp" type="number" min="1" max="10" step="1" value="1"></td></tr>' +
			'</tbody></table>' +
			'</td><td><button style="height:26px;width:26px;" onclick="addznamka(this);return false;">+</button></td></tr></tbody></table></td>' +
			'<td class="prumer"></td>' +
			'<td><button onclick="want(this);return false;">Chci:</button><input style="width:35px;height:13px;" type="number" min="1" max="5" step="1" value="1"></td>' +
			'<td class="want"><table class="znmala"><tr class="detznamka"></tr><tr class="typ"></tr></table></td>'
		);
		jQuery(this).find(".detznamka td").each(function () {
			jQuery(this).click(function () {
				jQuery(this).toggleClass("disabled");
				var index = jQuery(this).index();
				jQuery(this).parent().parent().parent().find(".typ td:eq(" + index + ")").toggleClass("disabled");
				calculateWeightedAvg();
			});
		});
	});
	jQuery("head").append("<style>.disabled{text-decoration:line-through;opacity:0.5;}");
}

function removeZnamka(id) {
	var thisid = $(id).attr('id');
	$("td[id=" + thisid + "]").remove();

	console.log("Removed znamka #" + thisid);
	calculateWeightedAvg();
}

function want(element) {
	var row = jQuery(element).parent().parent();
	var input = Number(jQuery(element).parent().find('input')[0].value);
	var table = row.find('.want table');
	var znamkyRow = table.find('.detznamka');
	var vahyRow = table.find('.typ');
	var processed = processRow(row);
	var wavg = Math.round(processed.sum / processed.sumvahy);

	znamkyRow.html('');
	vahyRow.html('');
	for (var i = 1; i <= 5; i++) {
		if (input === wavg) {
			var vaha = 'x';
		} else {
			if (input < wavg) {
				var wants = input + 0.49;
			} else {
				var wants = input - 0.5;
			}
			var required = (processed.sum - wants * processed.sumvahy) / (wants - i);
			if (required < 0) {
				var vaha = 'x'
			} else if (!isFinite(required)) {
				var vaha = '∞';
			} else {
				var vaha = required.toFixed(1);
			}
		}
		znamkyRow.append('<td>' + i + '</td>');
		vahyRow.append('<td>' + vaha + '</td>');
	}
}

jQuery(document).ready(function () {
	if (checkDetailEnabled()) {
		modifUI();
		calculateWeightedAvg();
	}
});
