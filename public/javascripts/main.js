
$(document).ready(function(){
    var table = $("#example").DataTable({
        ajax: "/manage/getResList/"+$('#target').text(),
        columns: [
            {data: "restaurant_name"},
            {data: "address"}
        ],
        select: true,
        searching: false,
        paging: false
    });
    
    $('#example tbody').on('click', 'tr', function(){
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
        }else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        
    })
    $('#deleteButton').click( function () {
        var ids = table.row('.selected').data()
        if(typeof ids != 'undefined')
            $.post('/manage/deleteItem',{name: ids.restaurant_name, address: ids.address, targetList: $('#target').text()},function(data){
                location.reload();
            })
        //table.row('.selected').remove().draw( false );
    });
    $('#btnRandom').click(function(){
        var option = $('#randomOptions').find("option:selected").text();
        $.get('/getRandomItem/'+option,function(data,status){
            $('#randomResult').html('<h2>'+data.restaurant_name+'</h2>'+'<p>地址:'+data.address+'</p>');
           
        })
    })
   
    
});