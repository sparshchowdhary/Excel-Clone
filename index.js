const $ = require("jquery");
const electron = require("electron").remote;
const dialog = electron.dialog;
const fsp = require("fs").promises;

$(document).ready(function () {
  
  let rows=[];
  
  function getDefaultCell(){
    let cell={
      val:'',
      fontFamily:'',
      fontSize:'',
      bold:false,
      italic:false,
      undeline:false,
      bgColour:'#FFFFFF',
      textColour:'#000000',
      valign:'middle',
      halign:'left',
      formula:'',
      upstream:[],
      downstream:[]
    };
    return cell;
  }

  function prepareCell(cdiv,cobj){
    $(cdiv).html(cobj.val);
    $(cdiv).css('font-family',cobj.fontFamily);
    $(cdiv).css('font-size',cobj.fontSize+'px');
    $(cdiv).css('font-weight',cobj.bold?'bold':'normal');
    $(cdiv).css('font-style',cobj.italic?'italic':'normal');
    $(cdiv).css('font-decoration',cobj.undeline?'underline':'none');
    $(cdiv).css('background-color',cobj.bgColour);
    $(cdiv).css('color',cobj.textColour);
    $(cdiv).css('text-family',cobj.halign);
  }

  $("#content-container").on("scroll", function () {
    $("#firstrow").css("top", $("#content-container").scrollTop());
    $("#firstcol").css("left", $("#content-container").scrollLeft());
    $("#topleftcell").css("top", $("#content-container").scrollTop());
    $("#topleftcell").css("left", $("#content-container").scrollLeft());
  });
  
  $("#new").on("click", function () {
    rows=[];//re initialize
    $("#grid").find(".row").each(function () {
      let cells=[];
      $(this).find(".cell").each(function () {
          let cell=getDefaultCell();
          cells.push(cell); 
          prepareCell(this,cell);
      });
      rows.push(cell);
    });
    $('#grid .cell:first').click();
    $('#home-menu').click();
  });
  
  $("#open").on("click", async function () {
    let dobj = await dialog.showOpenDialog();
    let data = await fsp.readFile(dobj.filePaths[0]);
    rows=JSON.parse(data);
    let i=0;
    $('#grid').find('.row').each(function(){
      let j=0;
      $(this).find('.cell').each(function(){
        let cell=rows[i][j];
        prepareCell(this,cell);
        j++;
      })
      i++;
    })
    $('#grid .cell:first').click();
    $('#home-menu').click();
  });

  $("#save").on("click", async function () {
    let dobj = await dialog.showSaveDialog();
    await fsp.writeFile(dobj.filePath, JSON.stringify(rows));
    alert("File saved successfully");
    $('#home-menu').trigger('click');
  });

  $("#grid").hover(function () { //change cursor 
      $(this).css("cursor", "cell");
    },function () {
      $(this).css("cursor", "auto");
    }
  );
  
  $('#menu-bar > div').on('click',function(){
     $('#menu-bar > div').removeClass('selected');
     $(this).addClass('selected');
     let menuContainerId=$(this).attr('data-content');
     $('#menu-content-container > div').css('display','none');//hide
     $('#'+menuContainerId).css('display','flex');
  });

  $('#font-family').on('change',function(){
    let fontFamily=$(this).val();
    $('#grid .cell.selected').each(function(){
      $(this).css('font-family',fontFamily);
      let rid=parseInt($(this).attr('rid'));
      let cid=parseInt($(this).attr('cid'));
      let cobj=rows[rid][cid];
      cobj.fontFamily=fontFamily;
    });
  });

  $('#font-size').on('change',function(){
    let fontSize=$(this).val();
    $('#grid .cell.selected').each(function(){
      $(this).css('font-size',fontSize + 'px');
      let rid=parseInt($(this).attr('rid'));
      let cid=parseInt($(this).attr('cid'));
      let cobj=rows[rid][cid];
      cobj.fontFamily=fontSize;
    });
  });
  
  $('#bold').on('click',function(){
    $(this).toggleClass('selected');
    let bold=$(this).hasClass('selected');
    $('#grid .cell.selected').each(function(){
      $(this).css('font-weight',bold?'bold':'normal');
      let rid=parseInt($(this).attr('rid'));
      let cid=parseInt($(this).attr('cid'));
      let cobj=rows[rid][cid];
      cobj.bold=bold;
    });
  }); 

  $('#italic').on('click',function(){
    $(this).toggleClass('selected');
    let italic=$(this).hasClass('selected');
    $('#grid .cell.selected').each(function(){
      $(this).css('font-style',italic?'italic':'normal');
      let rid=parseInt($(this).attr('rid'));
      let cid=parseInt($(this).attr('cid'));
      let cobj=rows[rid][cid];
      cobj.italic=italic;
     });
  });

  $('#underline').on('click',function(){
    $(this).toggleClass('selected');
    let underline=$(this).hasClass('selected');
    $('#grid .cell.selected').each(function(){
      $(this).css('text-decoration',underline?'underline':'none');
      let rid=parseInt($(this).attr('rid'));
      let cid=parseInt($(this).attr('cid'));
      let cobj=rows[rid][cid];
      cobj.undeline=underline;
     });
  }); 
  
  $('#bg-colour').on('click',function(){
    let bgColour=$(this).val();
    $('#grid .cell.selected').each(function(){
      $(this).css('background-color',bgColour);
      let rid=parseInt($(this).attr('rid'));
      let cid=parseInt($(this).attr('cid'));
      let cobj=rows[rid][cid];
      cobj.bgColour=bgColour;
     });
  }); 
  
  $('#text-colour').on('click',function(){
    let textColour=$(this).val();
    $('#grid .cell.selected').each(function(){
      $(this).css('color',textColour);
      let rid=parseInt($(this).attr('rid'));
      let cid=parseInt($(this).attr('cid'));
      let cobj=rows[rid][cid];
      cobj.textColour=textColour;
     });
  }); 

  $('.valign').on('click',function(){
    $('.valign').removeClass('selected');
    $('this').addClass('selected');
    let valign = $(this).attr('prop-val');
        $('#grid .cell.selected').each(function () {
          $(this).css('text-align', valign);
          let rid = parseInt($(this).attr('rid'));
          let cid = parseInt($(this).attr('cid'));
          let cobj = rows[rid][cid];
          cobj.valign = valign;
       })
  }); 

  $('.halign').on('click',function(){
    $('.halign').removeClass('selected');
    $('this').addClass('selected');
    let halign=$(this).attr('prop-val');
    $('#grid .cell.selected').each(function(){
      $(this).css('text-align',halign);
      let rid=parseInt($(this).attr('rid'));
      let cid=parseInt($(this).attr('cid'));
      let cobj=rows[rid][cid];
      cobj.halign=halign;
    })
  }); 
   
  $('#grid .cell').on('click',function(e){
    if(e.ctrlKey){
      $(this).addClass('selected');
    }else{
      $('#grid .cell').removeClass('selected');
      $(this).addClass('selected');
    }
    let rid=parseInt($(this).attr('rid'));
    let cid=parseInt($(this).attr('cid'));
    let cobj=rows[rid][cid];
    $('#font-family').val(cobj.fontFamily);
    $('#font-size').val(cobj.fontSize);
    
    if(cobj.bold){
      $('#bold').addClass('selected');
    }else{
      $('#bold').removeClass('selected');
    }

    if(cobj.italic){
      $('#italic').addClass('selected');
    }else{
      $('#italic').removeClass('selected');
    }

    if(cobj.undeline){
      $('#underline').addClass('selected');
    }else{
      $('#underline').removeClass('selected');
    }

    $('#bg-colour').val(cell.bgColour);
    $('#text-colour').val(cell.textColour);
    $('.halign').removeClass('selected');
    $('.halign[prop-val='+cell.halign+']').addClass('selected');

    $('#cellFormula').val(String.fromCharCode(cid+65)+(rid+1));
    $('#textFormula').val(cobj.formula);
  });
  
  

  function evaluateFormula(cobj){
     let formula=cobj.formula;
     for(let i=0;i<cobj.upstream.length;i++){
       let uso=cobj.upstream[i];
       let fuso=rows[uso.rid][uso.cid];
       let cellName=String.fromCharCode('A'.charCodeAt(0)+uso.cid)+(uso.rid+1);
       formula=formula.replace(cellName,fuso.val||0);
     }
     let nval=eval(formula);//use infix in place of eval
     return nval;
  }

  function updateVal(rid,cid,val,render){
    let cobj=rows[rid][cid];
    cobj.val=val;
    if(render){
      $('.cell[rid='+rid+'][cid='+cid+']').html(val);
    }
    for(let i=0;i<cobj.downstream.length;i++){
       let dso=cobj.downstream[i];
       let fdso=rows[dso.rid][dso.cid];
       let nval=evaluateFormula(fdso);
       updateVal(dso.rid,dso.cid,nval,true);
    }
  }

  function deleteFormula(rid,cid){
    let cobj=rows[rid][cid];
    cobj.formula='';
    for(let i=0;i<cobj.upstream.length;i++){
      let uso=cobj.upstream[i];
      let fuso=rows[uso.rid][uso.cid];
      for(let j=0;j<fuso.downstream.length;j++){
        let dso=fuso.downstream[j];
        if(dso.rid==rid&&dso.cid==cid){
          fuso.downstream.splice(j,1);
          break;
        }
      }
    }
    cobj.upstream=[];
  }
  
  function setUpFormula(rid,cid,formula){
    let cobj=rows[rid][cid];
    cobj.formula=formula;
    formula=formula.replace('(','').replace(')','');
    let comps=formula.split(' ');
    for(let i=0;i<comps.length;i++){
      if(comps[i].charCodeAt(0)>='A'.charCodeAt(0)&&comps[i].charCodeAt(0)<='Z'.charCodeAt(0)){
        let urid=parseInt(comps[i].substr(1))-1;
        let ucid=comps[i].charCodeAt(0)-'A'.charCodeAt(0);
        cobj.upstream.push({
          rid:urid,
          cid:ucid
        })
        let fuso=rows[urid][ucid];
        fuso.downstream.push({
          rid:rid,
          cid:cid
        })
      }
    }
  }

  $('#grid .cell').on('keyup', function(e){
    let rid=parseInt($(this).attr('rid'));
    let cid=parseInt($(this).attr('cid'));
    let cobj=rows[rid][cid];

    if(cobj.formula){
      $('#textFormula').val('');
      deleteFormula(rid,cid);
    }
    updateVal(rid,cid,$(this).html(),false); 
  })
  
  $('#textFormula').on('blur',function(){
    let formula=$(this).val();
    $('#grid .cell.selected').each(function(){
      let rid=parseInt($(this).attr('rid'));
      let cid=parseInt($(this).attr('cid'));
      let cobj=rows[rid][cid];
      if(cobj.formula){
        deleteFormula(rid,cid);
      }
      setUpFormula(rid,cid,formula);
      let nval=evaluateFormula(cobj);
      updateVal(rid,cid,nval,true);
    });
  })

  //$('#new').click();

});
