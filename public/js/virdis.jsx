

/** @jsx React.DOM */

var Models = {}, Collections = {};





Models.Reaction = Backbone.Model.extend({
    paramRoot: 'reaction',
    urlRoot: '/reaction',
});

Collections.ReactionCollection = Backbone.Collection.extend({
    model: Models.Reaction,
    url: '/reaction'
});


Models.Larry = Backbone.Model.extend({
    paramRoot: 'Larry',
    urlRoot: '/larry',
});

Collections.moleculeCollection = Backbone.Collection.extend({
    model: Models.Reaction,
    url: '/larry'
});
Collections.regCollection = Backbone.Collection.extend({
    model: Models.Reaction,
    url: '/reg'
});
Collections.loginCollection = Backbone.Collection.extend({
    model: Models.Reaction,
    url: '/login'
});
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;
var treeNode= null;
var barChartNode= null;
var lineChartNode= null;
var radialChartNode= null;
var drill = false;
var moleculeData;
var chemData = [];
var cursor = 0;

var twoSeries = false;
var weightArray = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
var propertyNode= null;
var graphType = 1;
var searchText;
var propTableType = 0;
function setTreeNode(v){
    treeNode =v;
}
function setBarChartNode(v){
    barChartNode =v;
}
function setLineChartNode(v){
    lineChartNode =v;
}
function setRadialChartNode(v){
    radialChartNode =v;
}

function setPropertyNode(v){
    propertyNode =v;
}

  function setMoleculeData(chem){

        switch(chem.length){
            case 1:
                propColumns1[1].text = chem[0].attributes["cname"];
                propDescription.columns = propColumns1;
                treeColumns1[2].text = chem[0].attributes["cname"];
                treeDescription.columns = treeColumns1;
                break;
            case 2:
                propColumns2[1].text = chem[0].attributes["cname"];
                propColumns2[2].text = chem[1].attributes["cname"];
                propDescription.columns = propColumns2;
                treeColumns2[2].text = chem[0].attributes["cname"];
                treeColumns2[3].text = chem[1].attributes["cname"];
                treeDescription.columns = treeColumns2;
                break;
            case 3:
                propColumns3[1].text = chem[0].attributes["cname"];
                propColumns3[2].text = chem[1].attributes["cname"];
                propColumns3[3].text = chem[2].attributes["cname"];
                propDescription.columns = propColumns3;

                treeColumns3[2].text = chem[0].attributes["cname"];
                treeColumns3[3].text = chem[1].attributes["cname"];
                treeColumns3[4].text = chem[2].attributes["cname"];
                treeDescription.columns = treeColumns3;
                break;
            case 4:
                propColumns3[1].text = chem[0].attributes["cname"];
                propColumns3[2].text = chem[1].attributes["cname"];
                propColumns3[3].text = chem[2].attributes["cname"];
                propColumns3[4].text = chem[3].attributes["cname"];
                propDescription.columns = propColumns3;

                treeColumns3[2].text = chem[0].attributes["cname"];
                treeColumns3[3].text = chem[1].attributes["cname"];
                treeColumns3[4].text = chem[2].attributes["cname"];
                treeColumns3[5].text = chem[3].attributes["cname"];
                treeDescription.columns = treeColumns3;
                break;
             case 5:
                propColumns3[1].text = chem[0].attributes["cname"];
                propColumns3[2].text = chem[1].attributes["cname"];
                propColumns3[3].text = chem[2].attributes["cname"];
                propColumns3[4].text = chem[3].attributes["cname"];
                propColumns3[5].text = chem[4].attributes["cname"];
                propDescription.columns = propColumns3;

                treeColumns3[2].text = chem[0].attributes["cname"];
                treeColumns3[3].text = chem[1].attributes["cname"];
                treeColumns3[4].text = chem[2].attributes["cname"];
                treeColumns3[5].text = chem[3].attributes["cname"];
                treeColumns3[6].text = chem[4].attributes["cname"];
                treeDescription.columns = treeColumns3;
                break;


        }
        propertyNode.jqxTreeGrid(propDescription);
        treeNode.jqxTreeGrid(treeDescription);
        treeNode.jqxTreeGrid({ editable:true });
        treeNode.jqxTreeGrid({ editSettings:{ saveOnPageChange: true, saveOnBlur: true, saveOnSelectionChange: true, cancelOnEsc: true, saveOnEnter: true, editOnDoubleClick: true, editOnF2: true } });

        if (chem.length == 3){
             propertyNode.jqxTreeGrid('hideColumn', 'chem3');
             propertyNode.jqxTreeGrid('hideColumn', 'chem4');
             treeNode.jqxTreeGrid('hideColumn', 'chem3');
             treeNode.jqxTreeGrid('hideColumn', 'chem4');
        } else  if (chem.length == 4){
             propertyNode.jqxTreeGrid('showColumn', 'chem3');
             propertyNode.jqxTreeGrid('hideColumn', 'chem4');
             treeNode.jqxTreeGrid('showColumn', 'chem3');
             treeNode.jqxTreeGrid('hideColumn', 'chem4');

        } else  if (chem.length == 5){
             propertyNode.jqxTreeGrid('showColumn', 'chem4');
             treeNode.jqxTreeGrid('showColumn', 'chem4');
        }
        sourceArray.length = 0;
        var seriesLength = radialChartNode.highcharts().series.length;
        for(var i = seriesLength - 1; i > -1; i--) {
            radialChartNode.highcharts().series[i].remove();
            barChartNode.highcharts().series[i].remove();
           // lineChartNode.highcharts().series[i].remove();
        }


        for (var j = 0; j< chem.length; j++){
              data = chem[j];
              radialChartNode.highcharts().addSeries({name:data.attributes["cname"] ,data: [], pointPlacement: 'on', color:colorSeries[j]});
              barChartNode.highcharts().addSeries({name:data.attributes["cname"], data: [], pointPlacement: 'on', color:colorSeries[j]});
             // lineChartNode.highcharts().addSeries({name:data.attributes["cname"], data: [], pointPlacement: 'on', color:colorSeries[j]});
              
             // treeNode.jqxTreeGrid('showColumn', 'chem'+ j);
              populateCategories(data.attributes.endpoints);
              for(var i=0;i<47;i++){
                    //treeNode.jqxTreeGrid('setColumnProperty', 'chem0','name',"fff");
                    if (j == 0)
                        treeNode.jqxTreeGrid('setCellValue', data.attributes.endpoints[i]["id"], 'weight',data.attributes.endpoints[i]["weight"] );
                    treeNode.jqxTreeGrid('setCellValue', data.attributes.endpoints[i]["id"], 'chem' +j,data.attributes.endpoints[i]["value"] );
                    sourceArray.push( data.attributes["tooltip"]);

                   
                    setMoleculeProperty(data,j);
              }


        }

        drawGraph();
  }
  function drawGraph(){
         for (var j = 0; j< chemData.length; j++){
            if (graphType == 1){
                if(drill)
                    setGraphDataDrill(chemData[j],j);
                else

                    setGraphData(chemData[j],j);

            } else
                setGraphDataLine(chemData[j],j);
        }
  }
  function  changeWeight(row,val){
            weightArray[row-1] = val == "0" ? 0 : ( val == "1" ? 1 : (val == "2" ? 2 : 3));
            if(chemData[0].attributes.endpoints[row-1]["weight"] != val){
                chemData[0].attributes.endpoints[row-1]["weight"] = val;
                setMoleculeData(chemData);
            }

  }

  function populateCategory(endpoints,start,cnt,res)  {
        var sum =0;
        var j = start;
        var den = 0;

        for(var i=0;i<cnt;i++){
            den += weightArray[j];
            sum  +=(weightArray[j] * parseFloat(endpoints[j++]["value"]));

        }
        endpoints[res]["value"] =(sum/den).toFixed(3);

  }
  function populateCategories(endpoints){
        populateCategory(endpoints,3,4,2);
        populateCategory(endpoints,8,4,7);
        populateCategory(endpoints,13,4,12);
        var sum =  weightArray[2] + weightArray[7] +weightArray[12];
        endpoints[1]["value"] =((weightArray[2] * parseFloat(endpoints[2]["value"]) +
                                 weightArray[7] * parseFloat(endpoints[7]["value"])  +
                                 weightArray[12] * parseFloat(endpoints[12]["value"]))/sum).toFixed(3);

        populateCategory(endpoints,19,8,18);
        populateCategory(endpoints,28,9,27);
        var sum =  weightArray[18] + weightArray[27];
        endpoints[17]["value"] =((weightArray[18] * parseFloat(endpoints[18]["value"]) +
                                  weightArray[27] *parseFloat( endpoints[27]["value"]))/ sum).toFixed(3);

        populateCategory(endpoints,41,4,40);
        sum =  weightArray[38] + weightArray[40] +weightArray[45];
        endpoints[37]["value"] =((weightArray[38] * parseFloat(endpoints[38]["value"]) +
                                   weightArray[40] * parseFloat(endpoints[40]["value"])  +
                                   weightArray[45] *parseFloat(endpoints[45]["value"]))/sum).toFixed(3);

        sum =  weightArray[1] + weightArray[17] +weightArray[37];
        endpoints[0]["value"] =((weightArray[1] *  parseFloat(endpoints[1]["value"]) +
                                 weightArray[17] *  parseFloat(endpoints[17]["value"])  +
                                 weightArray[37] *  parseFloat(endpoints[37]["value"]))/sum).toFixed(3);
  }
  var sourceArray = [];
  var colorSeries = ["#000080", "#800000", "#008000", "#4b0082", "#000000"];
  var colors = ["#afeeee","#0064b9", "#5f9ea0", "#da70d6","#9370db", "#ffd700","#d16200", "#974922" ];
  var colArr1= [colors[0], colors[1],colors[2], colors[3],colors[4], colors[5],colors[6], colors[7]];
  var colArr= [colors[0], colors[1],colors[2], colors[3],colors[4], colors[5],colors[6], colors[7]];
  var colArrDrill= [];
  var populateColArr = true;


    function bigImg(x,j) {
        x.src='data:image/png;base64,' + chemData[j].attributes["smilesImgLg"];

    }

    function normalImg(x,j) {
        x.src='data:image/png;base64,' + chemData[j].attributes["smilesImg"];
}
  function setMoleculeProperty(data,j){

        var arr = data.attributes["nfp"].split(",");
        var showDiamond = chemData.length > 1 ? chemData.length > 2 ? "showDiamond3"  : "showDiamond2" : "showDiamond1";
        var dia = "<div class='showDiamond "+showDiamond+"' >  <span class='redDiamond'>"+arr[0]+" </span> <span class='blueDiamond'> "+arr[1]+" </span><span class='yellowDiamond'> "+arr[2]+"</span> <span class='whiteDiamond'> "+arr[3]+" </span></div>";

        propertyNode.jqxTreeGrid('showColumn', 'chem'+ j);

        if (propTableType == 0){
            propertyNode.jqxTreeGrid('setCellValue', "46", 'chem'+ j,'<img onmouseover="bigImg(this,'+j+')" onmouseout="normalImg(this,'+j+')" src="data:image/png;base64,' + data.attributes["smilesImg"] + '"></img>');
            propertyNode.jqxTreeGrid('setCellValue', "2", 'chem'+ j,data.attributes["cname"] );
            propertyNode.jqxTreeGrid('setCellValue', "3", 'chem'+ j,data.attributes["formula"] );
            propertyNode.jqxTreeGrid('setCellValue', "4", 'chem'+ j,data.attributes["cas"] );
            propertyNode.jqxTreeGrid('setCellValue', "5", 'chem'+ j,data.attributes["smiles"] );
            propertyNode.jqxTreeGrid('setCellValue', "6", 'chem'+ j,data.attributes["inchi"] );
            propertyNode.jqxTreeGrid('setCellValue', "13", 'chem'+ j,data.attributes["iupac"] );

            propertyNode.jqxTreeGrid('setCellValue', "8", 'chem'+ j,data.attributes["moles"] );
            propertyNode.jqxTreeGrid('setCellValue', "9", 'chem'+ j,data.attributes["boil"] );
            propertyNode.jqxTreeGrid('setCellValue', "9", 'name', "BP(C&deg)" )
            propertyNode.jqxTreeGrid('setCellValue', "10", 'name', "MP(C&deg)" );
            propertyNode.jqxTreeGrid('setCellValue', "15", 'name', "Fl.P.(C&deg)" );
            propertyNode.jqxTreeGrid('setCellValue', "10", 'chem'+ j,data.attributes["melt"] );
            propertyNode.jqxTreeGrid('setCellValue', "11", 'chem'+ j,data.attributes["vapor"] );
            propertyNode.jqxTreeGrid('setCellValue', "12", 'chem'+ j,data.attributes["den"] );

            propertyNode.jqxTreeGrid('setCellValue', "15", 'chem'+ j,data.attributes["fp"] );
            propertyNode.jqxTreeGrid('setCellValue', "16", 'chem'+ j,data.attributes["viscosity"] );
            propertyNode.jqxTreeGrid('setCellValue', "17", 'chem'+ j,data.attributes["refraction"] );
            propertyNode.jqxTreeGrid('setCellValue', "18", 'chem'+ j,data.attributes["solubility"] );
            propertyNode.jqxTreeGrid('setCellValue', "19", 'chem'+ j,data.attributes["log"] );
            propertyNode.jqxTreeGrid('setCellValue', "20", 'chem'+ j,data.attributes["gravity"] );
            propertyNode.jqxTreeGrid('setCellValue', "21", 'chem'+ j,dia );
            propertyNode.jqxTreeGrid('setCellValue', "22", 'chem'+ j,data.attributes["mass"] );
        } else {

              propertyNode.jqxTreeGrid('setCellValue', "79", 'chem'+ j,data.attributes["log_kow"] );
              propertyNode.jqxTreeGrid('setCellValue', "80", 'chem'+ j,data.attributes["baf_arnot"] );
              propertyNode.jqxTreeGrid('setCellValue', "81", 'chem'+ j,data.attributes["bcf_arnot"] );
              propertyNode.jqxTreeGrid('setCellValue', "82", 'chem'+ j,data.attributes["btf_hl"] );
              propertyNode.jqxTreeGrid('setCellValue', "83", 'chem'+ j,data.attributes["hlc"] );
              propertyNode.jqxTreeGrid('setCellValue', "84", 'chem'+ j,data.attributes["koc_kow"] );
              propertyNode.jqxTreeGrid('setCellValue', "85", 'chem'+ j,data.attributes["kp_koa"] );
              propertyNode.jqxTreeGrid('setCellValue', "86", 'chem'+ j,data.attributes["log_baf_arnot"] );
              propertyNode.jqxTreeGrid('setCellValue', "87", 'chem'+ j,data.attributes["log_bcf_arnot"] );
              propertyNode.jqxTreeGrid('setCellValue', "88", 'chem'+ j,data.attributes["log_btf_hl"] );
              propertyNode.jqxTreeGrid('setCellValue', "89", 'chem'+ j,data.attributes["log_koa"] );
              propertyNode.jqxTreeGrid('setCellValue', "90", 'chem'+ j,data.attributes["log_koc"] );
              propertyNode.jqxTreeGrid('setCellValue', "91", 'chem'+ j,data.attributes["log_koc_kow"] );
              propertyNode.jqxTreeGrid('setCellValue', "92", 'chem'+ j,data.attributes["oh_hl"] );
              propertyNode.jqxTreeGrid('setCellValue', "93", 'chem'+ j,data.attributes["oh_k"] );
              propertyNode.jqxTreeGrid('setCellValue', "94", 'chem'+ j,data.attributes["oz_hl"] );
              propertyNode.jqxTreeGrid('setCellValue', "95", 'chem'+ j,data.attributes["oz_k"] );
        }


  }




  function resetSeries(){

         chemData.length=0;
  }



  function setGraphData(data,j) {
            var labels= ['Water Score', 'Air Score', 'Soil Score','Acute Health Score','Chronic Health Score',
                          'Fire Score', 'Special Score', 'Reactivity'];
            if(radialChartNode.highcharts().series.length == 0)
                          return;
            for(var i=0;i<8; i++)
                colArr[i]= colArr1[i];
            var arr = [];
            arr.push( {y:parseFloat(data.attributes.endpoints[2]["value"])});
            arr.push( parseFloat(data.attributes.endpoints[7]["value"]));
            arr.push( parseFloat(data.attributes.endpoints[12]["value"]));

            arr.push( parseFloat(data.attributes.endpoints[18]["value"]));
            arr.push( parseFloat(data.attributes.endpoints[27]["value"]));

            arr.push( parseFloat(data.attributes.endpoints[38]["value"]));
            arr.push( parseFloat(data.attributes.endpoints[40]["value"]));
            arr.push( parseFloat(data.attributes.endpoints[45]["value"]));

            radialChartNode.highcharts().setTitle({text: "Compound End-point"});

            //radialChartNode.highcharts().legend.allItems[j].update({name:data.attributes["cname"]});
            radialChartNode.highcharts().xAxis[0].setCategories(labels);

            radialChartNode.highcharts().series[j].setData(arr,true);
            radialChartNode.highcharts().series[j].show();




            setGraphArea();

    }

    function setGraphDataLine(data,j) {
                var labels= ['Water Score', 'Air Score', 'Soil Score','Acute Health Score','Chronic Health Score',
                              'Fire Score', 'Special Score', 'Reactivity'];
                for(var i=0;i<8; i++)
                    colArr[i]= colArr1[i];
                    var arr = [];
                    arr.push( {y:parseFloat(data.attributes.endpoints[2]["value"])});
                    arr.push( parseFloat(data.attributes.endpoints[7]["value"]));
                    arr.push( parseFloat(data.attributes.endpoints[12]["value"]));

                    arr.push( parseFloat(data.attributes.endpoints[18]["value"]));
                    arr.push( parseFloat(data.attributes.endpoints[27]["value"]));

                    arr.push( parseFloat(data.attributes.endpoints[38]["value"]));
                    arr.push( parseFloat(data.attributes.endpoints[40]["value"]));
                    arr.push( parseFloat(data.attributes.endpoints[45]["value"]));


                    barChartNode.highcharts().legend.allItems[j].update({name:data.attributes["cname"]});
                    barChartNode.highcharts().series[j].setData(arr,true);
                    barChartNode.highcharts().xAxis[0].setCategories(labels);
                    barChartNode.highcharts().setTitle({text: "Compound End-point"});
                  //  lineChartNode.highcharts().legend.allItems[j].update({name:data.attributes["cname"]});
                  //  lineChartNode.highcharts().series[j].setData(arr,true);
                  //  lineChartNode.highcharts().xAxis[0].setCategories(labels);
                  ///  lineChartNode.highcharts().setTitle({text: "Chemical Grades"});
                  //  lineChartNode.highcharts().series[j].show();
                    barChartNode.highcharts().series[j].show();

        }


    function setGraphDataDrill(data,k) {
               var labelsDrill= ['Persistence .', 'Exposure', 'Toxicity', 'LTE',
                                  'Persistence', 'Exposure', 'Toxicity', 'LTE',
                                  'Persistence', 'Exposure', 'Toxicity', 'LTE',
                                  'Oral','Dermal','IDLH','STEL',
                                  'Inhale', 'Skin ','Eye ','Odor',
                                  'Subchronic', 'Reproductive','Carcinogencity','Genotoxicty',
                                  'Neurotoxicity','RfC', 'RfD','Sensitizer','TLV',

                                  'Flamabilty', 'Radioactivity','Oxidizer','Reactivity',
                                  'Corosive','Explosivity'];
               radialChartNode.highcharts().xAxis[0].setCategories(labelsDrill);
               radialChartNode.highcharts().legend.allItems[k].update({name:data.attributes["cname"]});
               radialChartNode.highcharts().setTitle({text: "Compound End-point"});

              //treeNode.jqxTreeGrid('setColumnProperty', 'value', 'text', data.attributes["cname"]);

               var arr = [];
               var j=3;
               var c = 0;

               for(i=0;i<4;i++){
                  colArr[c++]=colors[0];
                 arr.push( parseFloat(data.attributes.endpoints[j++]["value"]));
               }

               j=8;
               for(i=0;i<4;i++){
                 colArr[c++]=colors[1];
                 arr.push( parseFloat(data.attributes.endpoints[j++]["value"]));
               }
               j=13;
               for(i=0;i<4;i++){
                  colArr[c++]=colors[2];
                  arr.push( parseFloat(data.attributes.endpoints[j++]["value"]));
               }
               j=19;
               for(i=0;i<8;i++){
                    colArr[c++]=colors[3];
                     arr.push( parseFloat(data.attributes.endpoints[j++]["value"]));
               }

               j=28;
               for(i=0;i<9;i++){
                    colArr[c++]=colors[4];
                    arr.push( parseFloat(data.attributes.endpoints[j++]["value"]));
               }

               colArr[c++]=colors[5];
               arr.push( parseFloat(data.attributes.endpoints[39]["value"]));
                j=41;
                for(i=0;i<4;i++){
                    colArr[c++]=colors[6];
                    arr.push( parseFloat(data.attributes.endpoints[j++]["value"]));
                }
                colArr[c++]=colors[7];
               arr.push( parseFloat(data.attributes.endpoints[46]["value"]));

               radialChartNode.highcharts().series[k].setData(arr,true);
               radialChartNode.highcharts().series[k].show();
               setGraphAreaDrill(4,0,0);
               setGraphAreaDrill(4,4,1);
               setGraphAreaDrill(4,8,2);
               setGraphAreaDrill(8,12,3);
               setGraphAreaDrill(9,20,4);
               setGraphAreaDrill(1,29,5);
               setGraphAreaDrill(4,30,6);
               setGraphAreaDrill(1,34,7);


       }




  function setGraphArea(){

         var parts = 8;
            var chart = radialChartNode.highcharts();

            for(var i = 0; i < 8; i++) {
                centerX = chart.plotLeft + chart.yAxis[0].center[0];
                centerY = chart.plotTop + chart.yAxis[0].center[1];
                axisLength = chart.yAxis[0].height;
                angleOffset = -Math.PI/2 -  Math.PI/(8);
                angleSegment = Math.PI/(parts/2) ;

                firstPointX = centerX + (axisLength * Math.cos(angleOffset + (angleSegment * i)));
                firstPointY = centerY + (axisLength * Math.sin(angleOffset + (angleSegment * i)));
                secondPointX = centerX + (axisLength * Math.cos(angleOffset + (angleSegment * (i+1))));
                secondPointY = centerY + (axisLength * Math.sin(angleOffset + (angleSegment * (i+1))));

                 chart.renderer.path([
                             'M', centerX, centerY,
                             'L', firstPointX, firstPointY,
                              'A',axisLength,axisLength ,0, 0,1  ,secondPointX, secondPointY,
                             'Z'
                         ]).attr({
                             fill: colors[i % colors.length],
                             'stroke-width': 1,
                             'opacity': 1
                         }).add();
            }


  }

   function clearGraphArea(){

           var parts = 8;
              var chart = radialChartNode.highcharts();
              chart.yAxis[0].isDirty = true;
              for(var i = 0; i < 8; i++) {
                  centerX = chart.plotLeft + chart.yAxis[0].center[0];
                  centerY = chart.plotTop + chart.yAxis[0].center[1];
                  axisLength = chart.yAxis[0].height;
                  angleOffset = -Math.PI/2 -  Math.PI/(8);
                  angleSegment = Math.PI/(parts/2) ;

                  firstPointX = centerX + (axisLength * Math.cos(angleOffset + (angleSegment * i)));
                  firstPointY = centerY + (axisLength * Math.sin(angleOffset + (angleSegment * i)));
                  secondPointX = centerX + (axisLength * Math.cos(angleOffset + (angleSegment * (i+1))));
                  secondPointY = centerY + (axisLength * Math.sin(angleOffset + (angleSegment * (i+1))));

                   chart.renderer.path([
                               'M', centerX, centerY,
                               'L', firstPointX, firstPointY,
                                'A',axisLength,axisLength ,0, 0,1  ,secondPointX, secondPointY,
                               'Z'
                           ]).attr({
                               fill: "#ffffff",
                               'stroke-width': 1,
                               'opacity': 1
                           }).add();
              }


    }


  function setGraphAreaDrill(count,startRad,color){
              var chart =radialChartNode.highcharts();
                centerX = chart.plotLeft + chart.yAxis[0].center[0];
                centerY = chart.plotTop + chart.yAxis[0].center[1];
                var axisLength=[];
                for (i=0;i<(count +1);i++)
                    axisLength.push(chart.yAxis[0].height  );
                angleSegment = Math.PI/(35)*2;
                angleOffset = -Math.PI/2 - Math.PI/(35);


                var drawArray = ['M',centerX,centerY];
                j=0;
                for (i=startRad;i<(startRad+count + 1);i++){
                    drawArray.push('L');
                    drawArray.push( centerX + (axisLength[j] * Math.cos(angleOffset + (angleSegment * i))));
                    drawArray.push(centerY + (axisLength[j++] * Math.sin(angleOffset + (angleSegment * i))));
                }
                 drawArray.push('Z');


                 radialChartNode.highcharts().renderer.path(drawArray).attr({
                                            fill: colors[ color],
                                            'stroke-width': 1,
                                            'opacity': 1
                                        }).add();
  }

  function cellClass(row, dataField, cellText, rowData) {

             if (parseInt(rowData["id"])>2 && parseInt(rowData["id"])<8)
                return "waterRow";
             if (parseInt(rowData["id"])>7 && parseInt(rowData["id"])<13)
                 return "airRow";
             if (parseInt(rowData["id"])>12 && parseInt(rowData["id"])<18)
                 return "soilRow";
             if (parseInt(rowData["id"])>18 && parseInt(rowData["id"])<28)
                return "acuteRow";
             if (parseInt(rowData["id"])>27 && parseInt(rowData["id"])<38)
                 return "chronicRow";
             if (parseInt(rowData["id"])>38 && parseInt(rowData["id"])<41)
                 return "fireRow";
             if (parseInt(rowData["id"])>40 && parseInt(rowData["id"])<46)
                 return "specialRow";
             if (parseInt(rowData["id"])>45 && parseInt(rowData["id"])<48)
                              return "reactivityRow";
   }
var data = [{
      "id": "1",
      "name": "Final Score",
      "chem0": "1230000",
      "weight": "1",
          "children": [{
          "id": "2",
          "name": "Ecological Score",
          "chem0": "423000",
          "weight": "1",
              "children": [{
              "id": "3",
              "name": "Water Score",
              "chem0": "113000",
              "weight": "1",
              children: [{
                     "id": "4",
                     "name": "Persistence",
                     "chem0": "24",
                     "weight": "1"
                 }, {
                     "id": "5",
                     "name": "Exposure",
                     "chem0": "70000",
                     "weight": "1"
                 },{
                     "id": "6",
                     "name": "Toxicity",
                     "chem0": "70000",
                     "weight": "1"
                   }, {
                    "id": "7",
                    "name": "Long Term Effect",
                    "chem0": "70000",
                    "weight": "1"
                   } ]
          }, {
              "id": "8",
              "name": "Air Score",
              "chem0": "310000",
              "weight": "1",
              children: [{
                  "id": "9",
                  "name": "Persistence",
                  "chem0": "24",
                  "weight": "1"
              }, {
                  "id": "10",
                  "name": "Exposure",
                  "chem0": "70000",
                  "weight": "1"
              },{
                  "id": "11",
                  "name": "Toxicity",
                  "chem0": "70000",
                  "weight": "1"
                }, {
                 "id": "12",
                 "name": "Long Term Effect",
                 "chem0": "70000",
                 "weight": "1"
                } ]
          },{
                 "id": "13",
                 "name": "Soil Score",
                 "chem0": "200000",
                 "weight": "1",
                  children: [{
                       "id": "14",
                       "name": "Persistence",
                       "chem0": "24",
                       "weight": "1"
                   }, {
                       "id": "15",
                       "name": "Exposure",
                       "chem0": "70000",
                       "weight": "1"
                   },{
                       "id": "16",
                       "name": "Toxicity",
                       "chem0": "70000",
                       "weight": "1"
                     }, {
                      "id": "17",
                      "name": "Long Term Effect",
                      "chem0": "70000",
                      "weight": "1"
                     } ]
            }]
      }, {
          "id": "18",
          "name": "Health Score",
          "chem0": "600000",
          "weight": "1",
              "children": [{
              "id": "19",
              "name": "Acute Health Score",
              "chem0": "300000",
              "weight": "1",
               children: [ {
                   "id": "20",
                   "name": "Oral LD50",
                   "chem0": "70000",
                   "weight": "1"
               },{
                   "id": "21",
                   "name": "Dermal LD50",
                   "chem0": "70000",
                   "weight": "1"
                 }, {
                  "id": "22",
                  "name": "IDLH",
                  "chem0": "70000",
                  "weight": "1"
                 } ,{
                  "id": "23",
                  "name": "STEL Ceiling",
                  "chem0": "24",
                  "weight": "1"
                 },{
                  "id": "24",
                  "name": "Inhalation LC50",
                  "chem0": "70000",
                  "weight": "1"
                 },{
                  "id": "25",
                  "name": "Skin Irritation",
                  "chem0": "70000",
                  "weight": "1"
                 }, {
                  "id": "26",
                  "name": "Eye Irritation",
                  "chem0": "70000",
                  "weight": "1"
                 } ,{
                  "id": "27",
                  "name": "Odor Threshold",
                  "chem0": "24",
                  "weight": "1"
                }]
          }, {
              "id": "28",
              "name": "Chronic Health Score",
              "chem0": "200000",
              "weight": "1",
               children: [ {
                    "id": "29",
                    "name": "Subchronic Toxicity",
                    "chem0": "70000",
                    "weight": "1"
                },{
                    "id": "30",
                    "name": "Reproductive Effect",
                    "chem0": "70000",
                    "weight": "1"
                  }, {
                   "id": "31",
                   "name": "Carcinogenicity",
                   "chem0": "70000",
                   "weight": "1"
                  } ,{
                   "id": "32",
                   "name": "Genotoxicity",
                   "chem0": "24",
                   "weight": "1"
                  },{
                   "id": "33",
                   "name": "Neurotoxicity",
                   "chem0": "70000",
                   "weight": "1"
                  },{
                   "id": "34",
                   "name": "RfC",
                   "chem0": "70000",
                   "weight": "1"
                  }, {
                   "id": "35",
                   "name": "RfD",
                   "chem0": "70000",
                   "weight": "1"
                  } ,{
                   "id": "36",
                   "name": "Sensitizer",
                   "chem0": "24",
                   "weight": "1"
                 },{
                  "id": "37",
                  "name": "TLV",
                  "chem0": "24",
                  "weight": "1"
                }]
          }]
      }, {
          "id": "38",
          "name": "Safety Score",
          "chem0": "200000",
          "weight": "1",
            "children": [{
            "id": "39",
            "name": "Fire Score",
            "chem0": "113000",
            "weight": "1",
            children: [{
                   "id": "40",
                   "name": "Flamability",
                   "chem0": "24",
                   "weight": "1"
               } ]
        }, {
            "id": "41",
            "name": "Special Score",
            "chem0": "310000",
            "weight": "1",
            children: [{
                "id": "42",
                "name": "Radioactivity",
                "chem0": "24",
                "weight": "1"
            }, {
                "id": "43",
                "name": "Oxidizer",
                "chem0": "70000",
                "weight": "1"
            },{
                "id": "44",
                "name": "Water-Reactive",
                "chem0": "70000",
                "weight": "1"
              }, {
               "id": "45",
               "name": "Corosive",
               "chem0": "70000",
               "weight": "1"
              } ]
        }, {
         "id": "46",
         "name": "Reactivity Score",
         "chem0": "2.4",
         "weight": "1",
         children: [{
             "id": "47",
             "name": "Explosivity",
             "chem0": "2.4",
             "weight": "1"
         } ]
                 }]
      }]
  }];

  var source = {
      dataType: "json",
      dataFields: [{
          name: "name",
          type: "string"
      }, {
          name: "chem0",
          type: "number"
      }, {
          name: "id",
          type: "number"
      }, {
          name: "children",
          type: "array"
      }, {
          name: "weight",
          type: "string"
      }],
      hierarchy: {
          root: "children"
      },
      localData: data,
      id: "id"
  };

  var data2 = [{
         "id": "46",
          "name": "Structure",
          "chem0": "",
        },{
        "id": "1",
        "name": "Identifications",
        "chem0": "",

            "children": [{
            "id": "2",
            "name": "Name",
            "chem0": "423000"


            }, {
                "id": "3",
                "name": "Formula",
                "chem0": "600000"

            }, {
                "id": "4",
                "name": "Cas#",
                "chem0": "200000"

               },{
                 "id": "5",
                  "name": "Smilies",
                  "chem0": "200000"
               },{
                    "id": "6",
                    "name": "InChI",
                    "chem0": "200000"
               } ,{
                "id": "13",
                "name": "IUPAC-name",
                "chem0": "200000"

               }
           ]

    },
    {

    "id": "8",
    "name": "MW(mol)",
    "chem0": "423000"


    }, {
        "id": "9",
        "name": "BP(C)",
        "chem0": "600000"

    }, {
        "id": "10",
        "name": "MP(C)",
        "chem0": "200000"

       },{
         "id": "11",
          "name": "VP(atm)",
          "chem0": "200000"
       },{
            "id": "12",
            "name": "DEN(g/cm3)",
            "chem0": "200000"
       },{
            "id": "15",
            "name": "Fl.P.(C)",
            "chem0": "200000"
       }, {
        "id": "16",
        "name": "Viscosity(Pa.s)",
        "chem0": "200000"

       },{
         "id": "17",
          "name": "RI",
          "chem0": "200000"
       },{
            "id": "18",
            "name": "WS(mg/L)",
            "chem0": "200000"
       }, {
        "id": "19",
        "name": "LogP",
        "chem0": "200000"

       },{
         "id": "20",
          "name": "SG",
          "chem0": "200000"
       },{
         "id": "22",
          "name": "Mass",
          "chem0": "200000"
       },{
            "id": "21",
            "name": "NFP",
            "chem0":"1"
       }


    ];



 var data3 = [{
         "id": "79",
          "name": "Log Kow",
          "chem0": "",
    }, {

    "id": "80",
    "name": "Baf Arnot",
    "chem0": "423000"


    }, {
        "id": "81",
        "name": "BCF Arnot",
        "chem0": "600000"

    }, {
        "id": "82",
        "name": "BTF HL",
        "chem0": "200000"

       },{
         "id": "83",
          "name": "HLC",
          "chem0": "200000"
       },{
            "id": "84",
            "name": "Koc Kow",
            "chem0": "200000"
       },{

            "id": "85",
            "name": "KP Koa",
            "chem0": "200000"
       }, {
        "id": "86",
        "name": "Log Baf Arnot",
        "chem0": "200000"

       },{
         "id": "87",
          "name": "Log Bcf Arnot",
          "chem0": "200000"
       },{
            "id": "88",
            "name": "Log Btf HL",
            "chem0": "200000"
       }, {
        "id": "89",
        "name": "Log Koa",
        "chem0": "200000"

       },{
         "id": "90",
          "name": "Log Koc",
          "chem0": "200000"
       },{
         "id": "91",
          "name": "Log Koc Kow",
          "chem0": "200000"
       },{
            "id": "92",
            "name": "OH HL",
            "chem0":"1"
       },
       {
           "id": "93",
           "name": "OH K",
           "chem0":"1"
       }, {
           "id": "94",
           "name": "OZ HL",
           "chem0":"1"
       },
       {
          "id": "95",
          "name": "OZ K",
          "chem0":"1"
       }


    ];
  var source2 = {
        dataType: "json",
        dataFields: [{
            name: "name",
            type: "string"
        }, {
            name: "chem0",
            type: "string"
        }, {
            name: "id",
            type: "number"
        }, {
            name: "children",
            type: "array"
        }
        ],
        hierarchy: {
            root: "children"
        },
        localData: data2,
        id: "id"
  };

  var source3 = {
          dataType: "json",
          dataFields: [{
              name: "name",
              type: "string"
          }, {
              name: "chem0",
              type: "string"
          }, {
              name: "id",
              type: "number"
          }, {
              name: "children",
              type: "array"
          }
          ],
          hierarchy: {
              root: "children"
          },
          localData: data3,
          id: "id"
    };
var treeColumns = [{
                    text: "Name",
                    cellClassName: cellClass,
                    align: "center",
                    dataField: "name",
                    width: 230,
                    editable:false,
                }, {
                    text: "Wt",
                    width: 40,
                    cellClassName: cellClass,
                    dataField: "weight",
                    cellsAlign: "center",
                    align: "center",
                    editable:true,
                    columntype:"template",
                     createEditor: function (row, cellvalue, editor, cellText, width, height) {

                                           // construct the editor.
                                           var source = ["0","1", "2","3"];
                                           editor.jqxDropDownList({autoDropDownHeight: true, source: source, width: '100%', height: '100%' });

                                       },
                                       initEditor: function (row, cellvalue, editor, celltext, width, height) {
                                           // set the editor's current value. The callback is called each time the editor is displayed.
                                           editor.jqxDropDownList('selectItem', cellvalue);
                                       },
                                       getEditorValue: function (row, cellvalue, editor) {
                                           // return the editor's value.

                                           changeWeight(parseInt(row),editor.val());
                                           return editor.val();


                                       }




                }

            ];
            var treeColumns1 = [{
                                text: "Name",
                                cellClassName: cellClass,
                                align: "center",
                                dataField: "name",
                                width: 230,
                                editable:false,
                            }, {
                                text: "Wt",
                                width: 40,
                                cellClassName: cellClass,
                                dataField: "weight",
                                cellsAlign: "center",
                                align: "center",
                                editable:true,
                                columntype:"template",
                                createEditor: function (row, cellvalue, editor, cellText, width, height) {
                                       // construct the editor.
                                       var source = ["0","1", "2","3"];
                                       editor.jqxDropDownList({autoDropDownHeight: true, source: source, width: '100%', height: '100%' });

                                 },
                                 initEditor: function (row, cellvalue, editor, celltext, width, height) {
                                       // set the editor's current value. The callback is called each time the editor is displayed.
                                       editor.jqxDropDownList('selectItem', cellvalue);
                                 },
                                 getEditorValue: function (row, cellvalue, editor) {
                                       // return the editor's value.
                                       changeWeight(parseInt(row),editor.val());
                                       return editor.val();


                                 }




                            }, {
                                  text: " ",
                                  cellClassName: cellClass,
                                  cellsAlign: "center",
                                  align: "center",
                                  width:310,
                                  dataField: "chem0",
                                  editable:false,
                                  cellsRenderer: function (row, column, value) {
                                        // render custom column.
                                        return "<span title='" + sourceArray[0] + "' >"+value+"</span>";
                                  }
                                }

            ];


var treeColumns2 = [{
                                text: "Name",
                                cellClassName: cellClass,
                                align: "center",
                                dataField: "name",
                                width: 230,
                                editable:false,
                            }, {
                                text: "Wt",
                                width: 40,
                                cellClassName: cellClass,
                                dataField: "weight",
                                cellsAlign: "center",
                                align: "center",
                                editable:true,
                                columntype:"template",
                                 createEditor: function (row, cellvalue, editor, cellText, width, height) {

                                                       // construct the editor.
                                                       var source = ["0","1", "2","3"];
                                                       editor.jqxDropDownList({autoDropDownHeight: true, source: source, width: '100%', height: '100%' });

                                                   },
                                                   initEditor: function (row, cellvalue, editor, celltext, width, height) {
                                                       // set the editor's current value. The callback is called each time the editor is displayed.
                                                       editor.jqxDropDownList('selectItem', cellvalue);
                                                       // editor.jqxDropDownList.bind('change', function (event) { alert(4) });
                                                   },
                                                   getEditorValue: function (row, cellvalue, editor) {
                                                       // return the editor's value.
                                                       changeWeight(parseInt(row),editor.val());
                                                       return editor.val();


                                                   }




                            }, {
                                  text: " ",
                                  cellClassName: cellClass,
                                  cellsAlign: "center",
                                  align: "center",
                                  width:155,
                                  dataField: "chem0",
                                  editable:false,
                                  cellsRenderer: function (row, column, value) {
                                        // render custom column.
                                        return "<span title='" + sourceArray[0] + "' >"+value+"</span>";
                                  }
                                },
                                 {
                                      text: " ",
                                      cellClassName: cellClass,
                                      cellsAlign: "center",
                                      align: "center",
                                      width:155,
                                      dataField: "chem1",
                                      editable:false,
                                      cellsRenderer: function (row, column, value) {
                                            // render custom column.
                                            return "<span title='" + sourceArray[1] + "' >"+value+"</span>";
                                      }
                                 }

             ];

var treeColumns3 = [{
                                text: "Name",
                                cellClassName: cellClass,
                                align: "center",
                                dataField: "name",
                                width: 230,
                                editable:false,
                            }, {
                                text: "Wt",
                                width: 40,
                                cellClassName: cellClass,
                                dataField: "weight",
                                cellsAlign: "center",
                                align: "center",
                                editable:true,
                                columntype:"template",
                                 createEditor: function (row, cellvalue, editor, cellText, width, height) {

                                                       // construct the editor.
                                                       var source = ["0","1", "2","3"];
                                                       editor.jqxDropDownList({autoDropDownHeight: true, source: source, width: '100%', height: '100%' });

                                                   },
                                                   initEditor: function (row, cellvalue, editor, celltext, width, height) {
                                                       // set the editor's current value. The callback is called each time the editor is displayed.
                                                       editor.jqxDropDownList('selectItem', cellvalue);
                                                       // editor.jqxDropDownList.bind('change', function (event) { alert(4) });
                                                   },
                                                   getEditorValue: function (row, cellvalue, editor) {
                                                       // return the editor's value.
                                                       changeWeight(parseInt(row),editor.val());
                                                       return editor.val();


                                                   }




                            }, {
                                  text: " ",
                                  cellClassName: cellClass,
                                  cellsAlign: "center",
                                  align: "center",
                                  width:104,
                                  dataField: "chem0",
                                  editable:false,
                                  cellsRenderer: function (row, column, value) {
                                        // render custom column.
                                        return "<span title='" + sourceArray[0] + "' >"+value+"</span>";
                                  }
                                },
                                 {
                                      text: " ",
                                      cellClassName: cellClass,
                                      cellsAlign: "center",
                                      align: "center",
                                      width:103,
                                      dataField: "chem1",
                                      editable:false,
                                      cellsRenderer: function (row, column, value) {
                                            // render custom column.
                                            return "<span title='" + sourceArray[1] + "' >"+value+"</span>";
                                      }
                                 },

                                  {
                                       text: " ",
                                       cellClassName: cellClass,
                                       cellsAlign: "center",
                                       align: "center",
                                       width:103,
                                       dataField: "chem2",
                                       editable:false,
                                       cellsRenderer: function (row, column, value) {
                                             // render custom column.
                                             return "<span title='" + sourceArray[2] + "' >"+value+"</span>";
                                       }
                                  },


                                    {
                                         text: " ",
                                         cellClassName: cellClass,
                                         cellsAlign: "center",
                                         align: "center",
                                         width:102,
                                         dataField: "chem3",
                                         editable:false,
                                         cellsRenderer: function (row, column, value) {
                                               // render custom column.
                                               return "<span title='" + sourceArray[3] + "' >"+value+"</span>";
                                         }
                                    }
                                    ,

                                    {
                                           text: " ",
                                           cellClassName: cellClass,
                                           cellsAlign: "center",
                                           align: "center",
                                           width:102,
                                           dataField: "chem4",
                                           editable:false,
                                           cellsRenderer: function (row, column, value) {
                                                 // render custom column.
                                                 return "<span title='" + sourceArray[4] + "' >"+value+"</span>";
                                           }
                                    }


                                ];


var propColumns =      [{
                            text: "Name",
                            align: "center",
                            dataField: "name",
                            width: 140,
                            editable:false,
                        }

                        ];

function customHeader(len,index,text){
                        var lft =(len +20)/2 - 10 * text.length/2;
                        var w1 = chemData[index].attributes["warning"].length> 0 ? chemData[index].attributes["warning"] : "good stuff";
                        var png1 = chemData[index].attributes["warning"].length> 0 ? '../img/warning.png' : '../img/warning.png';
                        return "<div style='margin-left:"+lft+"px; margin-top: 7px;'><img width='16' height='16' title = '"+w1+"' src='"+png1+"'/><span style='margin-left: 4px '>"+text+"</span><div style='clear: both;'></div></div>";

}



var propColumns1 =      [{
                            text: "Name",
                            align: "center",
                            dataField: "name",
                            width: 140,
                            editable:false,
                        }, {
                            text: " ",
                             width: 420,
                            dataField: "chem0",
                            cellsAlign: "center",
                            align: "center",
                            editable:false,
                            columntype:"template",
                            renderer: function (text, align, height) {
                                return customHeader(420,0,text);
                            },
                            cellsRenderer: function (row, column, value) {
                                  // render custom column.

                                  return "<span title='" + sourceArray[0] + "' >"+value+"</span>";
                            }
                        }

                        ];
var propColumns2 =      [{
                            text: "Name",
                            align: "center",
                            dataField: "name",
                            width: 140,
                            editable:false,
                        }, {
                            text: " ",
                             width: 210,
                            dataField: "chem0",
                            cellsAlign: "center",
                            align: "center",
                            editable:false,
                            columntype:"template",
                            renderer: function (text, align, height) {
                                return customHeader(210,0,text);
                            },
                            cellsRenderer: function (row, column, value) {
                                  // render custom column.



                                  return "<span title='" + sourceArray[0] + "' >"+value+"</span>";
                            }
                        },{

                              text: " ",
                              width: 210,
                              dataField: "chem1",
                              cellsAlign: "center",
                              align: "center",
                              editable:false,
                              columntype:"template",
                              renderer: function (text, align, height) {
                                return customHeader(210,1,text);
                              },
                              cellsRenderer: function (row, column, value) {
                                    // render custom column.
                                    return "<span title='" + sourceArray[1] + "' >"+value+"</span>";
                              }
                         }
                        ];
var propColumns3 =      [{
                            text: "Name",
                            align: "center",
                            dataField: "name",
                            width: 140,
                            editable:false,
                        }, {
                            text: " ",
                             width: 140,
                            dataField: "chem0",
                            cellsAlign: "center",
                            align: "center",
                            editable:false,
                            columntype:"template",
                            renderer: function (text, align, height) {
                                return customHeader(140,0,text);
                            },
                            cellsRenderer: function (row, column, value) {
                                  // render custom column.
                                  return "<span title='" + sourceArray[0] + "' >"+value+"</span>";
                            }
                        },{

                              text: " ",
                              width: 140,
                              dataField: "chem1",
                              cellsAlign: "center",
                              align: "center",
                              editable:false,
                              columntype:"template",
                            renderer: function (text, align, height) {
                                return customHeader(140,1,text);
                            },
                              cellsRenderer: function (row, column, value) {
                                    // render custom column.
                                    return "<span title='" + sourceArray[1] + "' >"+value+"</span>";
                              }
                         },
                         {

                               text: " ",
                               width: 140,
                               dataField: "chem2",
                               cellsAlign: "center",
                               align: "center",
                               editable:false,
                               columntype:"template",
                               renderer: function (text, align, height) {
                                   return customHeader(140,2,text);
                               },
                               cellsRenderer: function (row, column, value) {
                                     // render custom column.
                                     return "<span title='" + sourceArray[2] + "' >"+value+"</span>";
                               }

                         },
                         {

                                text: " ",
                                width: 140,
                                dataField: "chem3",
                                cellsAlign: "center",
                                align: "center",
                                editable:false,
                                columntype:"template",
                                renderer: function (text, align, height) {
                                    if(chemData.length == 3)
                                         return customHeader(140,2,text);
                                    return customHeader(140,3,text);
                                },
                                cellsRenderer: function (row, column, value) {
                                      // render custom column.
                                      return "<span title='" + sourceArray[3] + "' >"+value+"</span>";
                                }

                         },
                         {

                              text: " ",
                              width: 140,
                              dataField: "chem4",
                              cellsAlign: "center",
                              align: "center",
                              editable:false,
                              columntype:"template",
                              renderer: function (text, align, height) {
                                  if(chemData.length <5)
                                       return customHeader(140,2,text);
                                  return customHeader(140,4,text);
                              },
                              cellsRenderer: function (row, column, value) {
                                    // render custom column.
                                    return "<span title='" + sourceArray[4] + "' >"+value+"</span>";
                              }

                         }

                        ];



var propDescription =   {  source:  new $.jqx.dataAdapter(source2, {
                              loadComplete: function () {
                              }
                          }),
                        altRows: false,
                        width: 580,
                        height:222,
                        checkboxes: false,
                        autoRowHeight:true,
                        columns: propColumns
                        };
var treeDescription = {
                      source:  new $.jqx.dataAdapter(source, {
                                        loadComplete: function () {
                                        }
                                    }),
                      editable: true,
                      altRows: false,
                      width: 580,
                     // theme:'energyblue',
                      checkboxes: false,
                       editSettings: { saveOnPageChange: true, saveOnBlur: true,
                       saveOnSelectionChange: false, cancelOnEsc: true,
                       saveOnEnter: true, editOnDoubleClick: true, editOnF2: true },
                      columns: treeColumns
               };
var GreenAnalysis1 = React.createClass({



    render: function() {


        return (
            <div className="analyzer ">


                <div ref="treeview" id="treeGrid"></div>
            </div>
        );
    },

    componentDidMount: function() {




            $(this.refs.treeview.getDOMNode()).jqxTreeGrid(treeDescription);
              $(this.refs.treeview.getDOMNode()).jqxTreeGrid('expandRow', '1');
              $(this.refs.treeview.getDOMNode()).jqxTreeGrid('expandRow', '2');
              $(this.refs.treeview.getDOMNode()).jqxTreeGrid('expandRow', '18');
              $(this.refs.treeview.getDOMNode()).jqxTreeGrid('expandRow', '38');

              setTreeNode($(this.refs.treeview.getDOMNode()));



              $(this.refs.treeview.getDOMNode()).jqxTreeGrid({ editable:true });
              $(this.refs.treeview.getDOMNode()).jqxTreeGrid({ editSettings:{ saveOnPageChange: true, saveOnBlur: true, saveOnSelectionChange: true, cancelOnEsc: true, saveOnEnter: true, editOnDoubleClick: true, editOnF2: true } });
        }


});


var GreenProperties = React.createClass({



    render: function() {


        return (
            <div className="analyzer">
                <div className="propTable" ref="proptable" id="propTable"></div>
            </div>
        );
    },


    componentDidMount: function() {

            $(this.refs.proptable.getDOMNode()).jqxTreeGrid(propDescription);
            setPropertyNode($(this.refs.proptable.getDOMNode()));
            $(this.refs.proptable.getDOMNode()).jqxTreeGrid({ editable:false });
        }


});


var InputBox = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getDefaultProps: function() {
        return { input: '' };
    },
    render: function() {
        return (
            <input className="form-control" valueLink={this.props.input}></input>
        );
    }
});

var CodeBlock = React.createClass({
    componentDidMount: function() {
        Prism.highlightElement(this.getDOMNode());
    },
    componentDidUpdate: function(prevProps, prevState) {
        Prism.highlightElement(this.getDOMNode());
    },
    render: function() {
        var codeClass = "language-" + this.props.language;
        return <pre className={ codeClass }><code className={ codeClass }>{ this.props.code }</code></pre>
    }
});

var ChemicalProperty = React.createClass({
    render: function() {
        if (this.props.data) {
            return (
                <tr>
                    <td>{ this.props.header }</td>
                    <td>{ this.props.data }</td>
                </tr>
            );
        }
        else
            return null;
    }
});




var SearchChem = React.createClass({
    render: function() {
        return (
            <h4 >Search {this.props.title} Chemical </h4>

        );
    }
});

var ChemPropOld = React.createClass({
    render: function() {

        return (
            <Row>
              <Col xs={1}>{this.props.label} </Col>
              <Col xs={2} title={this.props.tip}><span className="ellipse">{this.props.value }</span>	 </Col>
            </Row>

        );
    }
});

var Warning = React.createClass({
     getInitialState: function() {
        return {
            link: true
        };
     },
     clicked: function(label, val,  cls){

         if(cls== "ellipse")
            return;
            alert(label+": "+val);

     },
    render: function() {

        var styles = {
            backgroundColor: '#FFA154'
        }

        return (
            <Row>
              <Col xs={12} title={this.props.tip}><span style={styles} ref="chemVal" onClick={this.clicked.bind(self, "Warning", this.props.tip,"" )}>{this.props.value}</span> </Col>

            </Row>
        );
    }
});


var ChemProp = React.createClass({
     getInitialState: function() {
        return {
            link: false
        };
     },
     clicked: function(label, val,  cls){

         if(cls== "ellipse")
            return;
            alert(label+": "+val);

     },
    render: function() {
        var cls= "ellipse";
        if(this.state.link){
            cls = "ellipseLink";

        }
        return (
            <Row>
              <Col xs={1}>{this.props.label} </Col>

              <Col xs={2} title={this.props.tip}><span ref="chemVal"   onClick={this.clicked.bind(self, this.props.label, this.props.value,cls )} className={cls}>{this.props.value}</span> </Col>

            </Row>
        );
    },
    componentDidMount: function() {
        if ( this.refs.chemVal.getDOMNode().scrollWidth >  190) {
            this.setState({ link: true });
        }else
            if(this.state.link) this.setState({ link: false });
    },
    componentDidUpdate: function() {
        if ( this.refs.chemVal.getDOMNode().scrollWidth >  190) {
           if(!this.state.link) this.setState({ link: true });
        }else
           if(this.state.link) this.setState({ link: false });
    }
});



var Diamond = React.createClass({
    render: function() {

        return (
            <div className={this.props.klass}>
                  <span className="redDiamond"> {this.props.red} </span>
                  <span className="blueDiamond"> {this.props.blue} </span>
                  <span className="yellowDiamond"> {this.props.yellow} </span>
                  <span className="whiteDiamond"> {this.props.white} </span>
            </div>

        );
    }
});


var MenuExample = React.createClass({

    getInitialState: function(){
        return { focused: 0 };
    },

    clicked: function(index){

        // The click handler will update the state with
        // the index of the focused menu entry

        this.setState({focused: index});
    },

    render: function() {

        // Here we will read the items property, which was passed
        // as an attribute when the component was created

        var self = this;

        // The map method will loop over the array of menu entries,
        // and will return a new array with <li> elements.

        return (
            <div  >

                <ul id="menu" >

                { this.props.items.map(function(m, index){

                    var style = '';

                    if(self.state.focused == index){
                        style = 'focused';
                    }

                    // Notice the use of the bind() method. It makes the
                    // index available to the clicked function:

                    return <li className={style} onClick={self.clicked.bind(self, index)}>{m}</li>;

                }) }

                </ul>


            </div>
        );

    }
});


var LineChart = React.createClass({
    render: function() {
            return (
            <div>
                <div ref="lineGraph">  </div>
            </div>


        )

    },
    componentDidMount: function() {
           setLineChartNode($(this.refs.lineGraph.getDOMNode()));
           $(this.refs.lineGraph.getDOMNode()).highcharts({


                                 chart: {

                                            type: 'line'




                                        },

                                        pane: {
                                            size: '40%'
                                        },


                                        xAxis: {
                                            categories: [

                                            ]
                                        },
                                        yAxis: {
                                            min: 0,
                                            title: {
                                                text: 'Grade'
                                            }
                                        },
                                        tooltip: {
                                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                                '<td style="padding:0"><b>{point.y:.2f} </b></td></tr>',
                                            footerFormat: '</table>',
                                            shared: true,
                                            useHTML: true
                                        },
                                        plotOptions: {
                                            column: {
                                                pointPadding: 0.2,
                                                borderWidth: 0,
                                                colorByPoint: true,
                                                colors: colArr


                                            }
                                        },
                                        series: [ ]

                                                  });
    }






});

var BarChart = React.createClass({
    render: function() {
            return (
            <div>
                <div ref="barGraph">  </div>
            </div>


        )

    },
    componentDidMount: function() {
           setBarChartNode($(this.refs.barGraph.getDOMNode()));
           $(this.refs.barGraph.getDOMNode()).highcharts({
                                  colors: ["#00ff00", "#ffff00", "#ffffff", "#000000", "#ff0000"],

                                 chart: {

                                            type: 'bar'




                                        },

                                        pane: {
                                            size: '40%'
                                        },


                                        xAxis: {
                                            categories: [

                                            ]
                                        },
                                        yAxis: {
                                            min: 0,
                                            title: {
                                                text: 'Grade'
                                            }
                                        },
                                        tooltip: {
                                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                                '<td style="padding:0"><b>{point.y:.2f} </b></td></tr>',
                                            footerFormat: '</table>',
                                            shared: true,
                                            useHTML: true
                                        },
                                        plotOptions: {
                                            column: {
                                                pointPadding: 0.2,
                                                borderWidth: 0,
                                                colorByPoint: true,
                                                colors: colArr


                                            }
                                        },
                                        series: [ ]

                                  });

    }






});

var RadialChart = React.createClass({
    render: function() {
            return (
            <div >

                <div  ref="radialGraph">  </div>
            </div>


        )



    },


    componentDidMount: function() {
           setRadialChartNode($(this.refs.radialGraph.getDOMNode()));
           $(this.refs.radialGraph.getDOMNode()).highcharts({
                                                          colors: ["#00ff00", "#ffff00", "#ffffff", "#000000", "#ff0000"],
                                                         chart: {

                                                            events: {
                                                                click:function(e){
                                                                    drill = !drill;
                                                                     drawGraph();
                                                                 }
                                                            },
                                                             polar: true,
                                                             renderTo: radialChartNode,
                                                             type: 'line'
                                                         },
                                                         pane:{
                                                            size:275,
                                                            center:[235,170]
                                                         },

                                                         title: {
                                                             text: 'Green Endpoints',
                                                             x: 70
                                                         },
                                                         marginLeft: 40,
                                                         width:500,
                                                         height:500,

                                                         xAxis: {

                                                             categories: ['Persistence .', 'Exposure', 'Toxicity', 'LTE',
                                                                          'Persistence', 'Exposure', 'Toxicity', 'LTE',
                                                                          'Persistence', 'Exposure', 'Toxicity', 'LTE',
                                                                          'Oral','Dermal','IDLH','STEL',
                                                                          'Inhale', 'Skin ','Eye ','Odor',
                                                                          'Subchronic', 'Reproductive','Carcinogencity','Genotoxicty',
                                                                          'Neurotoxicity','RfC', 'RfD','Sensitizer','TLV',

                                                                          'Flamabilty', 'Radioactivity','Oxidizer','Reactivity',
                                                                          'Corosive','Explosivity'],

                                                             tickmarkPlacement: 'on',
                                                             lineWidth: 0

                                                         },


                                                         yAxis: {
                                                             gridLineInterpolation: 'circle',
                                                             lineWidth: 0,
                                                             min: 0
                                                         },

                                                         tooltip: { formatter: function () {
                                                             var tips= ['Water Score', 'Air Score', 'Soil Score','Acute Health Score','Chronic Health Score',
                                                                            'Fire Score', 'Special Score', 'Reactivity']
                                                             var tipsDrill= ['Water Persistence', 'Water Exposure', 'Water Toxicity', 'Water LTE',
                                                                           'Air Persistence', 'Air Exposure', 'Air Toxicity', 'Air LTE',
                                                                           'Soil Persistence', 'Soil Exposure', 'Soil Air Toxicity', 'Soil LTE',
                                                                           'Oral LD50 ','Dermal LD50','IDLH','STEL Ceiling',
                                                                           'Inhalation LC50', 'Skin Irritation ','Eye Irritation','Odor Threshold',
                                                                           'Subchronic Toxicity', 'Reproductive Effect','Carcinogencity','Genotoxicty',
                                                                           'Neurotoxicity','RfC', 'RfD','Sensitizer','TLV',
                                                                           'Flamabilty', 'Radioactivity','Oxidizer','Water Reactivity',
                                                                           'Corosive','Explosivity']
                                                                  return( drill? tipsDrill[this.point.index] : tips[this.point.index] )+  ': ' + this.y; }
                                                         },
                                                       //  tooltip: {
                                                       //      shared: true,
                                                         //   pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.index:,.2f}</b><br/>'
                                                         //},

                                                         legend: {
                                                             align: 'right',
                                                             verticalAlign: 'top',
                                                             y: 70,
                                                             layout: 'vertical'
                                                         },

                                                         series: [ ]
                                                  });



    }






});

var clk=false;
var PropTabs = React.createClass({
	getInitialState: function() {
		return {
			tabs: [
				{title: 'Physical'},
                {title: 'Toxicology'}
			],
			active: 0
		};
	},
	render: function() {
		return(
		<div>
			<TabsSwitcher items={this.state.tabs} active={this.state.active} onTabClick={this.handleTabClick}/>
		</div>
		);
	},
	componentDidUpdate: function() {
	},
	handleTabClick: function(index) {
	   this.setState({active: index});
	   propTableType = index;
	   propDescription.source =  new $.jqx.dataAdapter(index ==0 ?source2:source3, {
                                             loadComplete: function () {
                                             }
                                         });
       propertyNode.jqxTreeGrid(propDescription);
       for (var j = 0; j< chemData.length; j++){
            setMoleculeProperty(chemData[j],j);
       }


	}
});

var GraphTabs = React.createClass({
	getInitialState: function() {
		return {
			tabs: [
				{title: 'Bar', content: <BarChart />},
                {title: 'Green Score', content: <RadialChart  />}
			],
			active: 1
		};
	},
	render: function() {
		return(
		<div>
			<TabsSwitcher items={this.state.tabs} active={this.state.active} onTabClick={this.handleTabClick}/>
			<TabsContent items={this.state.tabs} active={this.state.active}/>
		</div>
		);
	},
	componentDidUpdate: function() {
        if(chemData && clk )
             drawGraph();
        clk = false;
	},
	handleTabClick: function(index) {
	    graphType = index;
	    clk= true;
		this.setState({active: index});


	}
});

var TabsSwitcher = React.createClass({
	render: function() {
		var active = this.props.active;
		var items = this.props.items.map(function(item, index) {
			return <a href="#" className={'tab ' + (active === index ? 'tab_selected' : '')} onClick={this.onClick.bind(this, index)}>
				{item.title}
			</a>;
		}.bind(this));
		return <div>{items}</div>;
	},
	onClick: function(index) {
		this.props.onTabClick(index);
	}
});

var TabsContent = React.createClass({
	render: function() {
		var active = this.props.active;
		var items = this.props.items.map(function(item, index) {
			return <div className={'tabs-panel ' + (active === index ? 'tabs-panel_selected' : '')}>{item.content}</div>;
		});
		return <div>{items}</div>;
	}
});

var StructureImage = React.createClass({
	render: function() {


		var data= this.props.data;
		var items = this.props.dataStream.map(function(chem, key) {


             if (chem){
                 var imag = chem.attributes['smilesImg'];
                 if(chemData.length>1){
                     var imag2 = chem.attributes['smilesImg'];
                     var imag = chemData[0].attributes['smilesImg'];
                 }
                 return (
                    <div className="container">
                        <Row >

                            <Col xs={2}>
                                 <img  src={"data:image/png;base64," + imag}></img>
                            </Col>
                            <Col  xs={2}>
                                { chemData.length>1  ?
                                    <img src={"data:image/png;base64," + imag2}></img>
                                : null }
                            </Col>
                        </Row>
                    </div>

                 );
             }

        });
        return <div>{items}</div>;
	}
});
var searchType = 0;
var isSubmit;
var canRender = true;
var ViridisPocketbook = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
        return {
            reactionType: 'found',
            input: 'Benzaldehyde',
            moleculeSource: new Collections.moleculeCollection(),
            bufferSource: new Collections.moleculeCollection(),
            showResults: false,
            compare:false
        };
    },

    selectType: function(xxx) {
       if (xxx.target[0].selected){
            searchType = 0;
            $( ".ui-autocomplete-input" ).autocomplete( "enable" );
       } else  if (xxx.target[1].selected){

            searchType = 1;
            $( ".ui-autocomplete-input" ).autocomplete( "disable" );
       } else if (xxx.target[2].selected){
            searchType = 2;
             $( ".ui-autocomplete-input" ).autocomplete( "disable" );
       } else{
            searchType = 3;
            $( ".ui-autocomplete-input" ).autocomplete( "disable" );

       }
    },
    submitText: function() {

        if (!this.props.chkQuery()){
            alert ("Your trial has expired");
            return;
        }
        isSubmit = true;
        var srch =searchText.value.substr(0,1).toUpperCase() +
                  searchText.value.substr(1).toLowerCase();
       // this.setState({ compare: false });

        this.setState({ busy: true });
         this.state.bufferSource.fetch({ data: { input: srch, searchType: searchType }, success: this.success, fail: this.fail, type: 'POST' });


         canRender = false;
        this.setState({ showResults: true });
    },


    compareText: function() {
              if (!this.props.chkQuery()){
                   alert ("Your trial has expired");
                   return;
              }


              isSubmit = false;


               var srch =searchText.value.substr(0,1).toUpperCase() +
                                searchText.value.substr(1).toLowerCase();
              this.setState({ busy2: true });
              canRender =false;;
              this.state.bufferSource.fetch({ data: { input: srch, searchType: searchType }, success: this.success, fail: this.fail, type: 'POST' });


          },
    success: function() {
               canRender = true;

               if(!this.state.bufferSource.models[0].attributes['found']){
                    alert ("chemical not found");
                    this.setState({busy: false, busy2: false});
                    return;
               }
               if(!this.state.compare)
                     this.setState({compare:true});
               if (isSubmit){
                     cursor = 0;
                     if(treeNode){

                         resetSeries();

                     }
               } else {
                     if (cursor == 4)
                         chemData.length = 4;
                     else
                         cursor++;
                     if(cursor == 1){
                       propertyNode.jqxTreeGrid('setColumnProperty', 'chem0', 'width', 210);
                       propertyNode.jqxTreeGrid('setColumnProperty', 'chem1', 'width', 210);
                     }
                     else if(cursor == 2){
                         propertyNode.jqxTreeGrid('setColumnProperty', 'chem0', 'width', 140);
                         propertyNode.jqxTreeGrid('setColumnProperty', 'chem1', 'width', 140);
                         propertyNode.jqxTreeGrid('setColumnProperty', 'chem2', 'width', 140);

                     }
               }

               chemData[cursor] =this.state.bufferSource.models[0];
               this.setState({busy: false, busy2: false,moleculeSource:this.state.bufferSource, });
               this.props.func();
               setMoleculeData(chemData);
    },
    fail: function() {
        this.setState({busy: false});
    },
    handleRadio: function(event) {
        this.setState({reactionType: event.target.value});
    },




      componentDidMount: function() {

                          function fff (event,ui) {

                              $( ".ui-autocomplete-input" ).autocomplete('widget').css('z-index', 1000);
                              return false

                            }
//ftyj
                        $(this.refs.searchTxt.getDOMNode())[0].name = "chemicals";
                        searchText = $(this.refs.searchTxt.getDOMNode())[0];
                        PubChemJQuery.pcautocp({
                            dictionary: "pc_compoundnames",
                            fieldname: "chemicals",
                            minLength:4,
                            multiSelect: false
                        });

                        $( ".ui-autocomplete-input" ).autocomplete({

                                                                      open: fff
                                                                      });

                        $( ".ui-autocomplete-input" ).autocomplete( "enable" );






      },
    render: function() {
       // if (!canRender) return;
        var EndPoints = this.state.moleculeSource.map(function(chem, key) {



            return (
                <GreenAnalysis1  />

            );
        });

        var Graphs = this.state.moleculeSource.map(function(chem, key) {


                   // chemData[cursor] =chem;
                    return (
                        <GraphTabs  />
                    );
                });
        var Properties = this.state.moleculeSource.map(function(chem, key) {
            return (
               <div>
                <PropTabs/>
               <GreenProperties/>
               </div>
            );
        });

        var buttonContent = this.state.busy ? <img src="img/ajax-loader.gif"></img> : "Submit";
        var buttonContent2 = this.state.busy2 ? <img src="img/ajax-loader.gif"></img> : "Compare";
        var klassName = "showCompare";
        if (!this.state.compare)
             klassName = "hideComponent";

        return (
            <div className="container">


                 <Row className="bottom">
                     <Col  xs={2}>
                         <h4 >Search Chemical </h4>
                     </Col>
                    <Col  xs={1}>
                        <select className="typeSelector" onChange={this.selectType.bind(self)} >
                              <option value="name">Name</option>
                              <option value="cas">Cas #</option>
                              <option value="iupac">IUPAC</option>
                              <option value="smiles">Smiles</option>
                        </select>
                    </Col>
                    <Col  xs={5}>
                        <span className="ui-widget">

                            <InputBox  name ="chemicals" className="searchBox"  ref="searchTxt"   />
                        </span>
                    </Col>
                    <span  xs={4}>
                        <Button bsStyle="default" bsSize="small" onClick={this.submitText} disabled={this.state.busy}>{buttonContent}</Button>

                        <Button className={klassName} bsStyle="default" bsSize="small" onClick={this.compareText} disabled={this.state.busy2}>{buttonContent2}</Button>
                    </span>
                </Row>
                    <div className="container" >
                        <Row xs={12}>

                             <Col className="col-lg-6 col-md-12 col-sm-12 ">

                                <Row xs={12}>
                                    {Properties}
                                </Row>
                                <Row xs={12}>
                                    {EndPoints}
                                </Row>
                             </Col>
                             <Col className='col-lg-6 col-md-12 col-sm-12 '>
                                 <Row xs={12} className="topLeft" >
                                     {Graphs}
                                 </Row>
                             </Col>

                        </Row>

                    </div>


            </div>
        );
    }
});





var ViridisApp = React.createClass({
     getInitialState: function() {
            return {
               webState:2,
               userName:'',
               queries:100
            };
     },
    quit: function() {
        this.setState({webState:2});
    },
	render: function() {
	var me = this;
    var transition= function(state,name,queries){
        me.setState({webState:state,userName:name,queries});
    };
    var decr= function(){
        me.setState({webState:3,userName:me.state.userName,queries:me.state.queries - 1});
    };
    var chkQuery= function(){
            return me.state.queries > 0;
        };
	switch(this.state.webState){
	 case 1:
        return(
            <div className="whiteBG" xs={12}>
                 <ViridisRegister func={transition} />
            </div>
        );

    case 2:
        return(
             <div className="whiteBG" xs={12}>
             <ViridisLogin func={transition} />
             </div>
        );
	case 3:
		return(
		     <div xs={12} className="container">
		     <Row>
		          <Col xs={2}>
                        <h3 className="titleFont2">Viridis Chem</h3>
                  </Col>
		         <Col xs={6}>
		             <MenuExample  items={ ['Green Pocket Book', 'Green Analyzer', 'Integrated Planner'] } />
		         </Col>
		          <Col xs={4} className="menuSuffix">
                      <span   > Hi {this.state.userName} &nbsp;&nbsp;  Queries Left:{this.state.queries} &nbsp;&nbsp;&nbsp; <img className="exit" width='20' height='20'  onClick={this.quit.bind(this)} src='../img/exit.png' /></span>
                   </Col>
             </Row>
	         <ViridisPocketbook func={decr} chkQuery={chkQuery}/>
	         </div>
		);
	}
}
});


React.renderComponent(
  <ViridisApp />,
  document.getElementById('react-container')
);