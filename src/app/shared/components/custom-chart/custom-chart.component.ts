import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  ViewEncapsulation,
  AfterViewChecked
} from "@angular/core";

import {
  Language,
  DefaultLocale,
  LocaleService,
  TranslationService
} from "angular-l10n";
/**
 * d3 reference for getting the chart properties and
 * customising the chart
 */
declare let d3: any;

/**
 * Custom legend component used to render the custom legends below the donut chart and
 * provide the callback mechanism for legend click and clear mechanism
 * along with associating the chart options and rendering the text in
 * center for the given donut chart
 */
@Component({
  selector: "physicalsecurity-custom-chart",
  templateUrl: "./custom-chart.component.html",
  styleUrls: ["./custom-chart.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CustomChartComponent implements OnChanges, AfterViewChecked {
  @Language() lang: string;
  @DefaultLocale() defaultLocale: string;
  /**
   * Input right align property for the chart
   */
  @Input() rightAlign: boolean = false;

  /** input legend data for the custom legend */
  @Input() legendData: any[] = null;

  /** legend colors for the radio buttons */
  @Input() clearText: String = "";

  /** Chart options for rendering the chart  */
  @Input() chartOptions: any;

  /** unique identifier for the chart  */
  @Input() chartid: any;

  /**Legend click call back used to invoke the call back function on click legend */
  @Output() legendClickCallBack = new EventEmitter<string>();

  /** Clear click call back used to invoke the callback function on click of clear  */
  @Output() clearClickCallBack = new EventEmitter();

  /** Place holder for the selected legend label */
  private selectedLegLabel: String = "";

  /** Colors for rendering all the chart parts  */
  @Input() addClearBtn: boolean;

  /** Colors for rendering all the chart parts  */
  @Input() legendColors: any;

  /** Chart id element for adding center text */
  chartIdEle: String;

  /** options to render the donut chart */
  options: any;

  /**
   * Abstract constructor used to initialise the custom chart component
   */
  constructor(
    public locale: LocaleService,
    public translation: TranslationService
  ) { }

  /**
   * Invoke the legend call back function and provide the selected legend label
   * @param selectedLabel selected legend label
   **/
  legendClick(selectedLabel) {
    this.selectedLegLabel = selectedLabel;
    this.legendClickCallBack.emit(selectedLabel);
  }

  /**
   * invoke the clear call back function and reset the seleected legend label
   **/
  clearClick() {
    this.clearClickCallBack.emit();
    this.selectedLegLabel = "";
  }

  /**
   * Rendering the title and the no of incident as a centered text for the given chart id
   **/
  renderCenterText(chartId, legendData, title) {
    if (typeof legendData != "undefined" && legendData) {
      let svgChartEle = d3.select(chartId + " svg");
      let initSlice = svgChartEle
        .selectAll(chartId + " g.nv-slice")
        .filter(function (ele, indx) {
          return indx == 0;
        });
      //removing all the dynamic title elements to update with the new data
      let incElems = document.querySelectorAll(chartId + " .incEle");
      Array.prototype.forEach.call(incElems, function (incNode) {
        incNode.parentNode.removeChild(incNode);
      });
      let totalCount = 0;
      legendData.forEach(val => {
        totalCount += parseInt(val.y);
      });
      // Insert first line of text into middle of donut pie chart
      initSlice
        .insert("text", "g")
        .text(totalCount)
        .attr("class", "nv-pie-title noofinc incEle")
        .attr("text-anchor", "middle")
        .attr("dy", "-.55em");
      // Insert second line of text into middle of donut pie chart
      initSlice
        .insert("text", "g")
        .text(title)
        .attr("class", "nv-pie-title incDesc incEle")
        .attr("text-anchor", "middle")
        .attr("dy", ".85em");
    }
  }

  /**
   * Used to provide the chart options to the processing chart
   **/
  ngOnChanges() {
    let currChartOpt = this.chartOptions;
    this.chartIdEle = "#" + this.chartid;
    this.options = {
      chart: {
        type: currChartOpt.TYPE,
        height: currChartOpt.HEIGHT,
        margin: currChartOpt.MARGIN,
        color: this.legendColors,
        x: function (d) {
          return d.key;
        },
        y: function (d) {
          return d.y;
        },
        showLabels: currChartOpt.SHOWLABELS,
        donut: currChartOpt.DONUT,
        donutRatio: currChartOpt.DONMUTRATIO,
        labelThreshold: currChartOpt.LABELTHRESHHOLD,
        labelSunbeamLayout: currChartOpt.LABELSUNBEAMLAYOUT,
        growOnHover: currChartOpt.GROWONHOVER,
        showLegend: currChartOpt.SHOWLEGEND,
        valueFormat: function (d) {
          return d3.format(',.0f')(d);
        }
      }
    };
  }

  /**
   * Rendering the center text after the template for chart is redered
   **/

  ngAfterViewChecked() {
    this.renderCenterText(
      this.chartIdEle,
      this.legendData,
      this.chartOptions.TITLE
    );
  }
}
