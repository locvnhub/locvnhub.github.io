console.log('DEBUG LOAD')



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