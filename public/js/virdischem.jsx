/** @jsx React.DOM */

var Models = {}, Collections = {};

Models.Synthesis = Backbone.Model.extend({
    paramRoot: 'synthesis',
    urlRoot: '/synthesis',
});

Collections.SynthesisCollection = Backbone.Collection.extend({
    model: Models.Synthesis,
    url: '/synthesis'
});

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
var compareData = [];
var twoSeries = false;
var weightArray = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
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

 var data = [{
      "id": "1",
      "name": "Final Greener Chemical Grade",
      "value": "1230000",
      "weight": "1",
          "children": [{
          "id": "2",
          "name": "Ecological Score",
          "value": "423000",
          "weight": "1",
              "children": [{
              "id": "3",
              "name": "Water Score",
              "value": "113000",
              "weight": "1",
              children: [{
                     "id": "4",
                     "name": "Persistence",
                     "value": "24",
                     "weight": "1"
                 }, {
                     "id": "5",
                     "name": "Exposure",
                     "value": "70000",
                     "weight": "1"
                 },{
                     "id": "6",
                     "name": "Toxicity",
                     "value": "70000",
                     "weight": "1"
                   }, {
                    "id": "7",
                    "name": "Long Term Effect",
                    "value": "70000",
                    "weight": "1"
                   } ]
          }, {
              "id": "8",
              "name": "Air Score",
              "value": "310000",
              "weight": "1",
              children: [{
                  "id": "9",
                  "name": "Persistence",
                  "value": "24",
                  "weight": "1"
              }, {
                  "id": "10",
                  "name": "Exposure",
                  "value": "70000",
                  "weight": "1"
              },{
                  "id": "11",
                  "name": "Toxicity",
                  "value": "70000",
                  "weight": "1"
                }, {
                 "id": "12",
                 "name": "Long Term Effect",
                 "value": "70000",
                 "weight": "1"
                } ]
          },{
                 "id": "13",
                 "name": "Soil Score",
                 "value": "200000",
                 "weight": "1",
                  children: [{
                       "id": "14",
                       "name": "Persistence",
                       "value": "24",
                       "weight": "1"
                   }, {
                       "id": "15",
                       "name": "Exposure",
                       "value": "70000",
                       "weight": "1"
                   },{
                       "id": "16",
                       "name": "Toxicity",
                       "value": "70000",
                       "weight": "1"
                     }, {
                      "id": "17",
                      "name": "Long Term Effect",
                      "value": "70000",
                      "weight": "1"
                     } ]
            }]
      }, {
          "id": "18",
          "name": "Health Score",
          "value": "600000",
          "weight": "1",
              "children": [{
              "id": "19",
              "name": "Acute Health Score",
              "value": "300000",
              "weight": "1",
               children: [ {
                   "id": "20",
                   "name": "Oral LD50",
                   "value": "70000",
                   "weight": "1"
               },{
                   "id": "21",
                   "name": "Dermal LD50",
                   "value": "70000",
                   "weight": "1"
                 }, {
                  "id": "22",
                  "name": "IDLH",
                  "value": "70000",
                  "weight": "1"
                 } ,{
                  "id": "23",
                  "name": "STEL Ceiling",
                  "value": "24",
                  "weight": "1"
                 },{
                  "id": "24",
                  "name": "Inhalation LC50",
                  "value": "70000",
                  "weight": "1"
                 },{
                  "id": "25",
                  "name": "Skin Irritation",
                  "value": "70000",
                  "weight": "1"
                 }, {
                  "id": "26",
                  "name": "Eye Irritation",
                  "value": "70000",
                  "weight": "1"
                 } ,{
                  "id": "27",
                  "name": "Odor Threshold",
                  "value": "24",
                  "weight": "1"
                }]
          }, {
              "id": "28",
              "name": "Chronic Health Score",
              "value": "200000",
              "weight": "1",
               children: [ {
                    "id": "29",
                    "name": "Subchronic Toxicity",
                    "value": "70000",
                    "weight": "1"
                },{
                    "id": "30",
                    "name": "Reproductive Effect",
                    "value": "70000",
                    "weight": "1"
                  }, {
                   "id": "31",
                   "name": "Carcinogenicity",
                   "value": "70000",
                   "weight": "1"
                  } ,{
                   "id": "32",
                   "name": "Genotoxicity",
                   "value": "24",
                   "weight": "1"
                  },{
                   "id": "33",
                   "name": "Neurotoxicity",
                   "value": "70000",
                   "weight": "1"
                  },{
                   "id": "34",
                   "name": "RfC",
                   "value": "70000",
                   "weight": "1"
                  }, {
                   "id": "35",
                   "name": "RfD",
                   "value": "70000",
                   "weight": "1"
                  } ,{
                   "id": "36",
                   "name": "Sensitizer",
                   "value": "24",
                   "weight": "1"
                 },{
                  "id": "37",
                  "name": "TLV",
                  "value": "24",
                  "weight": "1"
                }]
          }]
      }, {
          "id": "38",
          "name": "Safety Score",
          "value": "200000",
          "weight": "1",
            "children": [{
            "id": "39",
            "name": "Fire Score",
            "value": "113000",
            "weight": "1",
            children: [{
                   "id": "40",
                   "name": "Flamability",
                   "value": "24",
                   "weight": "1"
               } ]
        }, {
            "id": "41",
            "name": "Special Score",
            "value": "310000",
            "weight": "1",
            children: [{
                "id": "42",
                "name": "Radioactivity",
                "value": "24",
                "weight": "1"
            }, {
                "id": "43",
                "name": "Oxidizer",
                "value": "70000",
                "weight": "1"
            },{
                "id": "44",
                "name": "Water-Reactive",
                "value": "70000",
                "weight": "1"
              }, {
               "id": "45",
               "name": "Corosive",
               "value": "70000",
               "weight": "1"
              } ]
        }, {
         "id": "46",
         "name": "Reactivity Score",
         "value": "2.4",
         "weight": "1",
         children: [{
             "id": "47",
             "name": "Explosivity",
             "value": "2.4",
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
          name: "value",
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

  function  changeWeight(row,val){
            weightArray[row-1] = val == "Ignore" ? 0 : ( val == "Normal" ? 1 : (val == "Important" ? 2 : 3));
            moleculeData.attributes.endpoints[row-1]["weight"] = val;

            setMoleculeData(moleculeData);
            if(twoSeries)
                 setCompareData(compareData[0]);
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
  var sourceArray2 = [];
  var colors = ["#afeeee","#008aff", "#0064b9", "#da70d6","#9370db", "#ffd700","#d16200", "#974922" ];
  var colArr1= [colors[0], colors[1],colors[2], colors[3],colors[4], colors[5],colors[6], colors[7]];
  var colArr= [colors[0], colors[1],colors[2], colors[3],colors[4], colors[5],colors[6], colors[7]];
  var colArrDrill= [];
  var populateColArr = true;
  function setMoleculeData(data){


          populateCategories(data.attributes.endpoints);
          for(var i=0;i<47;i++){
                treeNode.jqxTreeGrid('setCellValue', data.attributes.endpoints[i]["id"], 'weight',data.attributes.endpoints[i]["weight"] );
                treeNode.jqxTreeGrid('setCellValue', data.attributes.endpoints[i]["id"], 'value',data.attributes.endpoints[i]["value"] );
                sourceArray.push( data.attributes["tooltip"]);
          }

          radialChartNode.highcharts().series[1].hide();
          barChartNode.highcharts().series[1].hide();
          lineChartNode.highcharts().series[1].hide();
          twoSeries = false;
          if(drill)
               setGraphDataDrill(data);
          else
               setGraphData(data);
  }
  function setCompareData(data){
            compareData.length = 0
            compareData.push(data);

            populateCategories(data.attributes.endpoints);
            for(var i=0;i<47;i++){
                  treeNode.jqxTreeGrid('setCellValue', data.attributes.endpoints[i]["id"], 'chem2',data.attributes.endpoints[i]["value"] );
                  sourceArray2.push( data.attributes["tooltip"]);
            }


           if(drill)
                 setGraphDataDrillCompare(compareData);
           else
                 setGraphDataCompare(compareData);
    }

  function setGraphData(data) {
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

                radialChartNode.highcharts().setTitle({text: "Chemical Grades"});
                radialChartNode.highcharts().legend.allItems[0].update({name:data.attributes["cname"]});
                radialChartNode.highcharts().xAxis[0].setCategories(labels);
                radialChartNode.highcharts().series[0].setData(arr,true);
                barChartNode.highcharts().legend.allItems[0].update({name:data.attributes["cname"]});
                barChartNode.highcharts().series[0].setData(arr,true);
                barChartNode.highcharts().xAxis[0].setCategories(labels);
                barChartNode.highcharts().setTitle({text: "Chemical Grades"});
                lineChartNode.highcharts().legend.allItems[0].update({name:data.attributes["cname"]});
                lineChartNode.highcharts().series[0].setData(arr,true);
                lineChartNode.highcharts().xAxis[0].setCategories(labels);
                lineChartNode.highcharts().setTitle({text: "Chemical Grades"});



                setGraphArea();

    }

     function setGraphDataCompare(compare) {
                var data = compare[0];

                //treeNode.jqxTreeGrid('setColumnProperty', 'chem2', 'text', data.attributes["cname"]);
                twoSeries = true;
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

                    radialChartNode.highcharts().legend.allItems[1].update({name:data.attributes["cname"]});
                    radialChartNode.highcharts().series[1].setData(arr,true);
                    radialChartNode.highcharts().series[1].show();

                    barChartNode.highcharts().legend.allItems[1].update({name:data.attributes["cname"]});
                    barChartNode.highcharts().series[1].setData(arr,true);
                    barChartNode.highcharts().series[1].show();

                    lineChartNode.highcharts().legend.allItems[1].update({name:data.attributes["cname"]});
                    lineChartNode.highcharts().series[1].setData(arr,true);
                    lineChartNode.highcharts().series[1].show();


        }
    function setGraphDataDrill(data) {
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
               radialChartNode.highcharts().legend.allItems[0].update({name:data.attributes["cname"]});
               radialChartNode.highcharts().setTitle({text: "Green Endpoints"});
               barChartNode.highcharts().xAxis[0].setCategories(labelsDrill);
               barChartNode.highcharts().legend.allItems[0].update({name:'End Points'});
               barChartNode.highcharts().setTitle({text: "Green Endpoints"});
               lineChartNode.highcharts().xAxis[0].setCategories(labelsDrill);
               lineChartNode.highcharts().legend.allItems[0].update({name:'End Points'});
               lineChartNode.highcharts().setTitle({text: "Green Endpoints"});
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
                   radialChartNode.highcharts().series[0].setData(arr,true);

                   setGraphAreaDrill(4,0,0);
                   setGraphAreaDrill(4,4,1);
                   setGraphAreaDrill(4,8,2);
                   setGraphAreaDrill(8,12,3);
                   setGraphAreaDrill(9,20,4);
                   setGraphAreaDrill(1,29,5);
                   setGraphAreaDrill(4,30,6);
                   setGraphAreaDrill(1,34,7);

       }


  function setGraphDataDrillCompare(compare) {
            var data = compare[0];
            // treeNode.jqxTreeGrid('setColumnProperty', 'chem2', 'text', data.attributes["cname"]);
             radialChartNode.highcharts().legend.allItems[1].update({name:data.attributes["cname"]});
             treeNode.jqxTreeGrid('setColumnProperty', 'chem2', 'text', data.attributes["cname"]);
             radialChartNode.highcharts().series[1].show();
             twoSeries = true;
             var arr = [];
                   var j=3;
                   var c = 0;

                   for(i=0;i<4;i++){
                     arr.push( parseFloat(data.attributes.endpoints[j++]["value"]));
                   }

                   j=8;
                   for(i=0;i<4;i++){
                     arr.push( parseFloat(data.attributes.endpoints[j++]["value"]));
                   }
                   j=13;
                   for(i=0;i<4;i++){
                      arr.push( parseFloat(data.attributes.endpoints[j++]["value"]));
                   }
                   j=19;
                   for(i=0;i<8;i++){
                         arr.push( parseFloat(data.attributes.endpoints[j++]["value"]));
                   }

                   j=28;
                   for(i=0;i<9;i++){
                        arr.push( parseFloat(data.attributes.endpoints[j++]["value"]));
                   }

                   arr.push( parseFloat(data.attributes.endpoints[39]["value"]));
                    j=41;
                    for(i=0;i<4;i++){
                        arr.push( parseFloat(data.attributes.endpoints[j++]["value"]));
                    }
                   arr.push( parseFloat(data.attributes.endpoints[46]["value"]));
                   radialChartNode.highcharts().series[1].setData(arr,true);


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

var GreenAnalysis1 = React.createClass({



    render: function() {
        var c1 = twoSeries ? "chem1Short" : "chem1";
        var c2 = twoSeries ? "chem2" : "chem2Hide";
        var n1 = twoSeries ? moleculeData.attributes["cname"] : this.props.data.attributes["cname"];
        var n2 = twoSeries ? this.props.data2.attributes["cname"]: "";

        return (
            <div id="analyzer">
                 <span className={c1}> {n1}</span>
                 <span className={c2}> {n2}</span>

                <div ref="treeview" id="treeGrid"></div>
            </div>
        );
    },

    componentDidMount: function() {




            $(this.refs.treeview.getDOMNode()).jqxTreeGrid({
                                                    source:  new $.jqx.dataAdapter(source, {
                                                                      loadComplete: function () {
                                                                      }
                                                                  }),
                                                    altRows: false,
                                                    width: 565,
                                                   // theme:'energyblue',
                                                    checkboxes: false,
                                                     editSettings: { saveOnPageChange: true, saveOnBlur: true,
                                                     saveOnSelectionChange: false, cancelOnEsc: true,
                                                     saveOnEnter: true, editOnDoubleClick: true, editOnF2: true },
                                                    columns: [{
                                                        text: "Name",
                                                        cellClassName: cellClass,
                                                        align: "center",
                                                        dataField: "name",
                                                        width: 230,
                                                        editable:false,
                                                    }, {
                                                        text: "Weight",
                                                        width: 115,
                                                        cellClassName: cellClass,
                                                        dataField: "weight",
                                                        cellsAlign: "center",
                                                        align: "center",
                                                        editable:true,
                                                        columntype:"template",
                                                         createEditor: function (row, cellvalue, editor, cellText, width, height) {

                                                                               // construct the editor.
                                                                               var source = ["Ignore","Normal", "Important","Very Important"];
                                                                               editor.jqxDropDownList({autoDropDownHeight: true, source: source, width: '100%', height: '100%' });

                                                                           },
                                                                           initEditor: function (row, cellvalue, editor, celltext, width, height) {
                                                                               // set the editor's current value. The callback is called each time the editor is displayed.
                                                                               editor.jqxDropDownList('selectItem', cellvalue);
                                                                                editor.jqxDropDownList.bind('change', function (event) { alert(4) });
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
                                                          dataField: "value",
                                                          editable:false,
                                                          cellsRenderer: function (row, column, value) {
                                                                // render custom column.
                                                                return "<span title='" + sourceArray[row-1] + "' >"+value+"</span>";
                                                          }
                                                        },
                                                        {
                                                          text: " ",
                                                          cellClassName: cellClass,
                                                          cellsAlign: "center",
                                                          align: "center",
                                                          dataField: "chem2",
                                                          editable:false,
                                                          cellsRenderer: function (row, column, value) {
                                                                // render custom column.
                                                                return "<span title='" + sourceArray2[row-1] + "' >"+value+"</span>";
                                                          }
                                                        }

                                                        ]
                                             });
              $(this.refs.treeview.getDOMNode()).jqxTreeGrid('expandRow', '1');
              $(this.refs.treeview.getDOMNode()).jqxTreeGrid('expandRow', '2');
              $(this.refs.treeview.getDOMNode()).jqxTreeGrid('expandRow', '18');
              $(this.refs.treeview.getDOMNode()).jqxTreeGrid('expandRow', '38');
              $(this.refs.treeview.getDOMNode()).jqxTreeGrid('hideColumn', 'chem2');

              setTreeNode($(this.refs.treeview.getDOMNode()));



              $(this.refs.treeview.getDOMNode()).jqxTreeGrid({ editable:true });
              $(this.refs.treeview.getDOMNode()).jqxTreeGrid({ editSettings:{ saveOnPageChange: true, saveOnBlur: true, saveOnSelectionChange: true, cancelOnEsc: true, saveOnEnter: true, editOnDoubleClick: true, editOnF2: true } });
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

              <Col xs={2} title={this.props.tip}><span ref="chemVal" onClick={this.clicked.bind(self, this.props.label, this.props.value,cls )} className={cls}>{this.props.value}</span> </Col>

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
var SearchChemResults = React.createClass({
    render: function() {

        var data = this.props.data;
        if(twoSeries)
            data = moleculeData;


        return (
            <div>
            { data.attributes["warning"].length > 0 ? <Warning value="This chemical has acute toxicity.  Click to learn more." tip={data.attributes["warning"]} /> : null }
            <h4 >Search Results </h4>
            <Row>
                <Col className="col-sm-12 col-md-12 col-lg-3">
                    <div className="container">
                       <ChemProp label ="Name" value={data.attributes["cname"]} tip={data.attributes["tooltip"]} />
                       <ChemProp label ="Formula" value={data.attributes["formula"]} tip={data.attributes["tooltip"]} />
                       <ChemProp label ="Cas#" value={data.attributes["cas"]} tip={data.attributes["tooltip"]} />
                       <ChemProp label ="Smiles" value={data.attributes["smiles"]} tip={data.attributes["tooltip"]} />
                       <ChemProp label ="InChI" value={data.attributes["inchi"]} tip={data.attributes["tooltip"]} />
                    </div>
                </Col>
                 <Col className="col-sm-12 col-md-12 col-lg-3">
                     <div className="container">
                       <ChemProp label ="MW" value={data.attributes["moles"]} tip={data.attributes["tooltip"]} />
                       <ChemProp label ="Bp" value={data.attributes["boil"]} tip={data.attributes["tooltip"]} />
                       <ChemProp label ="Mp" value={data.attributes["melt"] } tip={data.attributes["tooltip"]} />

                       <ChemProp label ="Log P" value={data.attributes["log"]} tip={data.attributes["tooltip"]} />
                       <ChemProp label ="VP" value={data.attributes["vapor"]} tip={data.attributes["tooltip"]} />

                     </div>
                 </Col>


            </Row>
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
                <ul id="menu" >{ this.props.items.map(function(m, index){

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
                                  colors: ["#00ff00", "#ffff00", "#ffffff", "#000000", "#ff0000"],

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
                                        series: [{
                                            name: 'Endpoints',
                                            data: []

                                            },{
                                            name: 'Chem2',
                                                   data: []

                                            }
                                            ]

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
                                        series: [{
                                            name: 'Endpoints',
                                            data: []

                                            },{
                                            name: 'Chem2',
                                                   data: []

                                            }
                                            ]

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
                                                                     if(drill){
                                                                           setGraphDataDrill(moleculeData);
                                                                           if(compareData.length)
                                                                               setGraphDataDrillCompare(compareData);
                                                                     } else{
                                                                           setGraphData(moleculeData);
                                                                            if(compareData.length)
                                                                                setGraphDataCompare(compareData);
                                                                            }

                                                                 }
                                                            },
                                                             polar: true,
                                                             renderTo: radialChartNode,
                                                             type: 'line'
                                                         },
                                                         pane:{
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

                                                         series: [{
                                                             name: 'Chem1',
                                                             data: [],
                                                             pointPlacement: 'on'
                                                         },
                                                         {
                                                              name: 'Chem2',
                                                              data: [],
                                                              pointPlacement: 'on'
                                                          },
                                                         ]
                                                  });



    }






});


var GraphTabs = React.createClass({
	getInitialState: function() {
		return {
			tabs: [
			    {title: 'Bar', content: <BarChart value={this.props.data}  />},
				{title: 'Line', content: <LineChart value={this.props.data}  />},
				{title: 'Radial', content: <RadialChart value={this.props.data}  />}
			],
			active: 2
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
	handleTabClick: function(index) {
		this.setState({active: index})
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

var DiamondStructure = React.createClass({
	render: function() {


		var data= this.props.data;
		var items = this.props.dataStream.map(function(chem, key) {


             if (chem){
                 var imag = data.attributes['smilesImg'];
                 return (
                    <div className="container">
                        <Row >
                            <Col xs={1}>
                                <Diamond red='2' blue='4' yellow='2' white='3' klass= "showDiamond" />
                            </Col>
                            <Col xs={2}>
                                 <img src={"data:image/png;base64," + imag}></img>
                            </Col>
                        </Row>
                    </div>

                 );
             }

        });
        return <div>{items}</div>;
	}
});
var ViridisApplication = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
        return {
            reactionType: 'found',
            input: 'Benzaldehyde',
            moleculeSource: new Collections.moleculeCollection(),
            showResults: false,
            compare:false
        };
    },
    submitText: function() {
        if(treeNode){

            treeNode.jqxTreeGrid('hideColumn', 'chem2');
            radialChartNode.highcharts().series[1].hide();
            barChartNode.highcharts().series[1].hide();
            lineChartNode.highcharts().series[1].hide();
            twoSeries = false;
            //treeNode.jqxTreeGrid('setColumnProperty', 'value','name',"fff");
        }
        this.setState({ compare: false });
        this.state.moleculeSource.fetch({ data: { input: this.state.input, reactionType: this.state.reactionType }, success: this.success, fail: this.fail, type: 'POST' });
        this.setState({ showResults: true });
        this.setState({ busy: true });
    },


    compareText: function() {
              // clearGraphArea();
               twoSeries = true;
              this.setState({ compare: true });
              this.state.moleculeSource.fetch({ data: { input: this.state.input, reactionType: this.state.reactionType }, success: this.success, fail: this.fail, type: 'POST' });

              this.setState({ busy2: true });
          },
    success: function() {
              this.setState({busy: false});
              this.setState({busy2: false});

               if (treeNode){

                   if (!this.state.compare)
                       setMoleculeData(this.state.moleculeSource.models[0]);
                   else {
                        treeNode.jqxTreeGrid('showColumn', 'chem2');
                        setCompareData(this.state.moleculeSource.models[0]);
                   }

               }
    },
    fail: function() {
        this.setState({busy: false});
    },
    handleRadio: function(event) {
        this.setState({reactionType: event.target.value});
    },
    render: function() {

        var outputElements = this.state.moleculeSource.map(function(chem, key) {
            if(!moleculeData)
                moleculeData= chem;
            return (
                <div className="container rel" >
                    <Row >
                        <Col className="col-sm-12 col-md-12 col-lg-12">
                            <SearchChemResults data={moleculeData} />

                        </Col>

                    </Row>
                    <Row>
                         <Col className="col-sm-12 col-md-12 col-lg-6">
                                <GreenAnalysis1 data={ moleculeData} data2={chem} />
                         </Col>
                         <Col className="col-sm-7 col-md-7 col-lg-6 graphContainer">
                                <GraphTabs data={ moleculeData} />
                         </Col>
                     </Row>
                </div>
            );
        });

        var buttonContent = this.state.busy ? <img src="img/ajax-loader.gif"></img> : "Submit";
        var buttonContent2 = this.state.busy2 ? <img src="img/ajax-loader.gif"></img> : "Compare";
        var klassName = "hideComponent";
        if(this.state.showResults){
            klassName = "showCompare";
        }
        return (
            <div className="container">

                <MenuExample xs={12} items={ ['Green Pocket Book', 'Green Analyzer', 'Integrated Planner', 'Tools'] } />
                    <div className="container">
                        <Row xs={12}>
                            <Col className="col-sm-4 col-md-4 col-lg-4">
                                { this.state.showResults ? <SearchChem  title="Another" /> : <SearchChem  title="" /> }

                                <InputBox className="searchBox" input={this.linkState('input')} ref="searchTxt"   />
                                <Button bsStyle="default" bsSize="small" onClick={this.submitText} disabled={this.state.busy}>{buttonContent}</Button>
                                <Button className={klassName} bsStyle="default" bsSize="small" onClick={this.compareText} disabled={this.state.busy2}>{buttonContent2}</Button>
                            </Col>
                             <Col className="col-sm-2 col-md-2 col-lg-3">
                                  <DiamondStructure dataStream={this.state.moleculeSource} data={moleculeData} />
                            </Col>
                        </Row>
                    </div>
                    { outputElements }

            </div>
        );
    }
});

React.renderComponent(
  <ViridisApplication />,
  document.getElementById('react-container')
);