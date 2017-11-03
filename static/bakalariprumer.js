/*
Name: Bakalari Actions
Author: FHR; fhrnet.eu
Version: 1.1
Licence: GPL v3
*/

var znamka = 0;
var vaha = 0;
var lastid = 0;


function calculateWeightedAvg() {
	var prumer = jQuery('.prumer');
	if (prumer.length) {
		prumer.remove();
	}

	jQuery(".radekznamky").children("tbody").children("tr").each(function () {
		var znamky = [];
		var vahy = [];
		var sumznamky = 0;
		var sumvahy = 0;
		var sum = 0;
		var wavg = 0;


		jQuery(this).find(".typ").each(function () {
			jQuery(this).find("td").not(".disabled").each(function () {
				vaha = Number(jQuery(this).text().replace(/U/g, 6).replace(/X/g, 10).replace(/R/g, 3).replace(/P/g, 4).replace(/C/g, 10));
				vahy.push(vaha);
				sumvahy += vaha;
			});

		});

		jQuery(this).find(".detznamka").each(function () {
			jQuery(this).find("td").not(".disabled").each(function () {
				znamka = Number(jQuery(this).text().replace(/X/g, 0).replace(/\?/g, 0).replace(/U/g, 0).replace(/N/g, 0).replace(/A/g, 0).replace(/1-/g, 1.5).replace(/2-/g, 2.5).replace(/3-/g, 3.5).replace(/4-/g, 4.5).replace(/-/g, 0).replace(/!$/, ''));
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
		wavg = (Math.round(sum / sumvahy * 100) / 100).toFixed(2);
		if (isNaN(wavg)) {
			wavg = 0;
		}

		jQuery(this).append(jQuery('<td class="prumer"><span style="color:blue; font-size: 18pt;">' + wavg + '</span>'));
	});

	console.log("Recalculated averages");
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
	znamka = jQuery(element).parent().parent().find('.inznamka').val();
	vaha = jQuery(element).parent().parent().find('.intyp').val();
	jQuery(element).closest('table').parent().parent().find('.detznamka').append('<td class="modif" id="znamka_' + (lastid + 1) + '" onclick="removeZnamka(this)" style="color:darkgreen">' + znamka + "</td>");
	jQuery(element).closest('table').parent().parent().find('.typ').append('<td class="modif" id="znamka_' + (lastid + 1) + '" onclick="removeZnamka(this)" style="color:darkgreen">' + vaha + "</td>");

	lastid += 1;

	calculateWeightedAvg();
}

function modifUI() {
	jQuery(".radekznamky").children("tbody").children("tr").each(function () {
		jQuery(this).append(
			'<td><table cellpadding="0" cellspacing="0" border="0"><tbody><tr><td>' +
			'<table cellpadding="0" cellspacing="0" border="0"><tbody>' +
			'<tr><td><input style="position:relative;width:35px;height:13px;margin:0;" class="inznamka" type="number" min="1" max="5" step="1" value="1"></td></tr>' +
			'<tr><td><input style="position:relative;width:35px;height:13px;margin:0;" class="intyp" type="number" min="1" max="10" step="1" value="1"></td></tr>' +
			'</tbody></table>' +
			'</td><td><button style="height:26px;width:26px;" onclick="addznamka(this);return false;">+</button></td></tr></tbody></table></td>');
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

jQuery(document).ready(function () {
	if (checkDetailEnabled()) {
		modifUI();
		calculateWeightedAvg();
	}
});
