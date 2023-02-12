console.log('DEBUG LOAD')



this.setAmountInWords = function (_vatrate) {
  
    var totalNum = $("#Total").val() || "0"
    var VATkhac = $('#VATRateF').val() || "0"
        VATkhac = VATkhac.FormatNumUK()
        totalNum  = totalNum.FormatNumUK()
        totalNumABS  = Math.abs(totalNum)
 
     if(totalNum == 0 ){
          $("#Amount").val(0).attr("value", 0);
          $("#VATAmount").val("0");
          $("#AmountInWords").val("Không đồng")
         return totalNum;
     } 
     
         var _vatamount = 0; 
         var _amount = 0; 
         _vatrate = parseFloat(_vatrate)
        if(_vatrate == -99){
            _vatamount = parseFloat( ((totalNum * VATkhac) / 100).toFixed(BteGlobal.ROUND_TOTAL) )
            _amount = (totalNum + _vatamount);
        }
        else if (_vatrate > 0) { 
             _vatamount = parseFloat( ((totalNum * _vatrate) / 100).toFixed(BteGlobal.ROUND_TOTAL) )
             _amount = (totalNum + _vatamount);
         } else {
             $("#VATAmount").val("0");
             _amount = totalNum;
         } 
         var amountF = parseFloat(_amount.toFixed(BteGlobal.ROUND_TOTAL)) 
 
         if ($('#INV_TYPE').val() == "3" || (amountF < 0 && location.pathname == '/AdJust/CreateAdJustInvWithToken') ) {
            //   amountF = amountF  * -1
            //   _vatamount = parseFloat(_vatamount) * -1
             $("#AmountInWords").val("Giảm " + Math.abs(amountF).ReadNumber(typeCurrency).replace(/\s\s+/g, ' ').toLowerCase());
         } else{
               $("#AmountInWords").val(parseFloat(amountF).ReadNumber(typeCurrency).replace(/\s\s+/g, ' '));
         } 
 
         $("#VATAmount").val(_vatamount.format(0, 3, typeCurrency));
         $("#Amount").val(amountF.format(0, 3, typeCurrency)).attr("value", amountF.format(0, 3, typeCurrency));  
 };

 

this.convertAmount = function () {
    var _tyGia;
    var strTyGia = $("#ExchangeRate").val().FormatNumUK();
    if (strTyGia) {
        _tyGia = parseFloat(strTyGia);
    } else {
        _tyGia = 0;
        $("#ExchangeRate").val(0);
    };
    if (($("#Amount").val() !== null) && (_tyGia >= 0) && $("#CurrencyUnit").val() != "VND") {
        var _amount = parseFloat($("#Amount").val().FormatNumUK());
        var _TongSoTien = parseFloat((_amount * _tyGia).toFixed() ); 

        if($('INV_TYPE').val() == "3"){
            $("#ConvertedAmount").val('-'+_TongSoTien.format(0, 3, "USD"));
        }else 
        $("#ConvertedAmount").val(_TongSoTien.format(0, 3, "USD"));
    };
};

this.formatTagInputNumber = function (typeCurrency) { 

    $("#ConvertedAmount").InitialMoneyUSD();
    $('table.products tbody input._number').unbind('focusout');
    $("#ExchangeRate").formatOnlyNumber();
    $('table.products tbody input._number')
        .each(function (i, item) {
            console.log(` formatTagInputNumber Class ` + $(item).attr('class')  + '   val- '  +  $(item).val() )

            if ($(this).val() =="" ) return
            fnInitialFormatNumber(this);
            if( !  (BteGlobal.IS_EDIT ||  BteGlobal.IS_SIGN_REPLACE_TOKEN ) ){
                $(this).parents('tr:first').find('input.amount').trigger('change');
            } 
        }).ForceNumericOnly()
        .focus(function () {
            var _val = $(this).val();
            $(this).val(_val.replaceAll('.', ''));
        })
        .focusout(function () {
            fnFocusOut(this);
            if( ! (BteGlobal.IS_EDIT || BteGlobal.IS_SIGN_REPLACE_TOKEN ) ){
                $(this).parents('tr:first').find('input.amount').trigger('change');
            }
        });
    $('table.list-bin-bottom tbody input._number').unbind('focusout');
    $('.groupTotal')
        .each(function (i, item) {
            fnInitialFormatNumber(this);
        }).ForceNumericOnly()
        .focus(function () {
            var _val = $(this).val();
            $(this).val(_val.replaceAll('.', ''));
        })
        .focusout(function () {
            fnFocusOut(this);
        });
};


this.readAfterAmountChanged = function () { 
    var _totalamount = parseFloat($('#Total').val().FormatNumUK());
    var _vatamount = 0;
    if ($('#VATAmount').val()) {
        _vatamount = parseFloat($('#VATAmount').val().FormatNumUK());
    }
    var _amount = Math.abs(_totalamount) + Math.abs(_vatamount); 

    if($('#INV_TYPE').val()=="3"){
          $('#AmountInWords').val("Giảm " + Math.abs(parseFloat(_amount)) .ReadNumber(typeCurrency).replace(/\s\s+/g, ' ').toLowerCase()   );
          _amount = _amount * -1
        }else {
        $('#AmountInWords').val((parseFloat($('#Amount').val().FormatNumUK()).ReadNumber(typeCurrency).replace(/\s\s+/g, ' ')));
       
    }
    $('#Amount').val(_amount.format(2, 3, typeCurrency)).trigger('change')
    //.trigger('focusout');
   
};