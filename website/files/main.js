$( document ).ready(function() {
	/*
    $("html").on("contextmenu",function(){
		swal({title: "", text: "School Eğitim Kurumları'ndan önceden alınmış yazılı izni olmaksızın School Bilgi Merkezinde bulunan hiçbir içerik kopyalanamaz, yeniden üretilemez, çoğaltılamaz ya da herhangi bir şekilde kullanılamaz."});
       return false;
    });
	*/
	$("#servisNO").change(function(event){
		var servis_no = $('#servisNO').val();
		$.ajax({
			url: '../../ajax/anket/komtur',
			type: "POST",
			data: 'sID=' + servis_no,
			dataType: 'json',
			success: function(data){
				console.log(data);
				if (data !== null)
				{
					$.each(data, function(index, value){
						if (index > 0)
							$('#r_' + index + '_' + value).prop('checked', true);
						else
							$('#diger').val(value);
						
						$('#btn_anket').addClass("btn-success");
						$('#btn_anket').val("Güncelle");
					});
				}
				else
				{
					$('.anket_cevap').prop('checked', false);
					$('#diger').val('');
					$('#btn_anket').removeClass("btn-success");
					$('#btn_anket').val("Kaydet");
				}
			}	        
		});	
	});

	$('#speakup_yil_donem').on('change', function() {
	  var yil_donem = this.value;
	  var vimeo = $('#hdn_' + yil_donem).val();

	  $('#vimeo_iframe').attr('src', 'https://player.vimeo.com/video/' + vimeo);
	  $('#download-video').attr('href', '/indir/video/' + vimeo);
	})

	$("#bg_button").on('click', function (e) {
	    e.preventDefault();
	    $('#bg_error').html('');
	    var pw = $('#pw').val();
	   	if (pw == "schoolteknoloji")
	   		$('#bg').submit();
	   	else
	   		$('#bg_error').html("Hatalı şifre. Lütfen tekrar deneyin.");
	});

	$('body').on('click', '.video_button', function(){
		var vimeo_id = $(this).attr('data-attr-id');
		$('#video_frame').attr('src', 'https://player.vimeo.com/video/' + vimeo_id);
		console.log('https://player.vimeo.com/video/' + vimeo_id);
		$('#video_modal').modal('show');
	})


	$('#video_modal').on('hidden.bs.modal', function () {
		$('#video_frame').removeAttr('src');
	});

	$('#prev_day').on('click', function(){
		var date_value = $(this).attr('data-attr-date');
		var p_date = new Date(date_value);  
		p_date.setDate(p_date.getDate() - 1);
		var p_date_format = new Date(p_date);
		var formatted_date = p_date_format.getFullYear() + "-" + appendLeadingZeroes(p_date_format.getMonth() + 1) + "-" + appendLeadingZeroes(p_date_format.getDate())
		console.log(formatted_date);
		$('#next_day, #prev_day').attr('data-attr-date', formatted_date);
		console.log(p_date);

		$.ajax({
			url: '../ajax/uzaktan_egitim',
			type: "POST",
			data: 'sID=' + formatted_date,
			dataType: 'json',
			success: function(data){
				console.log(data);
				if (data.length > 0)
				{
					console.log(data);
					var out = '\
						<table class="table table-file" id="table_content">\
		                    <thead>\
		                        <tr>\
		                            <th class="col-md-2">DERS</th>\
		                            <th class="col-md-2">BRANŞ</th>\
		                            <th class="col-md-4">AÇIKLAMA</th>\
		                            <th class="col-md-2">TARİH</th>\
		                            <th></th>\
		                        </tr>\
		                    </thead>\
		                    <tbody id="tbody_content">\
					';
					$.each(data, function(index, value){
						out += '<tr><td>'+ value.DERS_ADI +'</td><td>'+ value.BRANS_ADI +'</td><td>'+ value.ders_anlatim_text +'</td><td>'+ value.yayin_tarihi +'</td><td><img src="../assets/ui/video.png" class="video_button" data-attr-id="'+ value.vimeo_url +'" style="cursor: pointer;" /></td></tr>'
					});

					out += '</tbody></table>';

					$('#table_container').html(out);
					//$('#warning_content').hide();
					//$('#table_content').show();
				}
				else{
					//$('#table_content').hide();
					$('#table_container').html('Görüntülenecek içerik bulunmamaktadır.');
				}
			}	        
		});	
	})

	$('#next_day').on('click', function(){
		var date_value = $(this).attr('data-attr-date');
		var p_date = new Date(date_value);  
		p_date.setDate(p_date.getDate() + 1);
		var p_date_format = new Date(p_date);
		var formatted_date = p_date_format.getFullYear() + "-" + appendLeadingZeroes(p_date_format.getMonth() + 1) + "-" + appendLeadingZeroes(p_date_format.getDate())
		console.log(formatted_date);
		$('#next_day, #prev_day').attr('data-attr-date', formatted_date);
		console.log(p_date);

		$.ajax({
			url: '../ajax/uzaktan_egitim',
			type: "POST",
			data: 'sID=' + formatted_date,
			dataType: 'json',
			success: function(data){
				console.log(data);
				if (data.length > 0)
				{
					console.log(data);
					var out = '';
					$.each(data, function(index, value){
						out += '<tr><td>'+ value.DERS_ADI +'</td><td>'+ value.BRANS_ADI +'</td><td>'+ value.ders_anlatim_text +'</td><td>'+ value.yayin_tarihi +'</td><td><img src="../assets/ui/video.png" class="video_button" data-attr-id="'+ value.vimeo_url +'" style="cursor: pointer;" /></td></tr>'
					});
					$('#tbody_content').html(out);
					$('#warning_content').hide();
					$('#table_content').show();
				}
				else{
					$('#table_content').hide();
					$('#warning_content').html('Görüntülenecek içerik bulunmamaktadır.').show();
				}
			}	        
		});	
	})
});

function setDivValue(divID,v)
{
	$('#'+divID).html(v);
}



function getPreviousWorkday(){
  let workday = moment();
  let day = workday.day();
  let diff = 1;  // returns yesterday
  if (day == 0 || day == 1){  // is Sunday or Monday
    diff = day + 2;  // returns Friday
  }
  return workday.subtract(diff, 'days');
}

function appendLeadingZeroes(n){
  if(n <= 9){
    return "0" + n;
  }
  return n
}