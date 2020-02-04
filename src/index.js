import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

class ReactTable extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      loading: false,
      rowData: [],
      limit: 0,
      isLimitReached: false
    };
    this.loadData = this.loadData.bind(this);
  }

  loadData() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({
        loading: false,
        rowData: this.props.data.slice(0, this.state.limit + this.props.rowsLimit),
        limit: this.state.limit + this.props.rowsLimit,
        isLimitReached: this.state.limit + this.props.rowsLimit > this.props.data.length ? true : false
      });
    }, 5000);
    return;
  };

  componentDidMount() {
    const { rowsLimit, data, isVirtualScroll } = this.props;
    this.setState({ limit: rowsLimit, rowData: isVirtualScroll ? data.slice(0, rowsLimit ? rowsLimit : 10) : data });
    document.querySelector(".scrollable-columns > .sc-body").addEventListener("scroll", () => {
      let parent = document.querySelector(".scrollable-columns > .sc-body");
      document.querySelector(".fixed-column > .fc-body").scrollTop = parent.scrollTop;
      document.querySelector(".scrollable-columns > .sc-heading").scrollLeft = parent.scrollLeft;
      if (this.props.isVirtualScroll && parent.scrollHeight === parent.offsetHeight + parent.scrollTop && !this.state.isLimitReached && !this.state.loading) {
        this.loadData();
      }
    }, { passive: true });
  }

  render() {
    const { loading, rowData } = this.state;
    const { columns, fixedColWidth, scrollableColWidth } = this.props;
    return (
      <div>
        <div className="fixed-column">
          <div className="fc-heading" style={{ width: fixedColWidth ? fixedColWidth : 150 }}>
            {columns && columns.length > 0 && <span>{columns[0].header}</span>}
          </div>
          <div className="fc-body" style={{ height: this.props.height ? this.props.height : 500 }}>
            {
              rowData && rowData.length > 0 && rowData.map((dataObj, index) => {
                return (
                  <div key={`fc-value-${index}`} className="fc-row" style={{ width: fixedColWidth ? fixedColWidth : 150 }}>
                    {dataObj[columns[0].accessor]}
                  </div>
                )
              })
            }
            {
              loading && (
                <div className="fc-row" key='fc-loading' style={{ width: fixedColWidth ? fixedColWidth : 150 }}>
                  <span className="skeleton-root skeleton-text skeleton-pulse"></span>
                </div>
              )
            }
          </div>
        </div>
        <div className="scrollable-columns" style={{ marginLeft: fixedColWidth ? fixedColWidth + 32 : 182, width: scrollableColWidth ? scrollableColWidth : 800 }}>
          <div className="sc-heading">
            {columns && columns.length > 0 && columns.map((column, index) => {
              if (index !== 0) {
                return (
                  <div key={`sc-head-value-${index}`} className="sc-head" style={{ width: scrollableColWidth ? scrollableColWidth / 6 : 150 }}>
                    <p>{column.header}</p>
                  </div>
                )
              }
            })
            }
          </div>
          <div className="sc-body" style={{ height: this.props.height ? this.props.height : 500 }}>
            {
              rowData && rowData.length > 0 && rowData.map((dataObj, index) => {
                return (
                  <div key={`sc-row-${index}`} className="sc-row">
                    {columns.map((column, indx) => {
                      if (indx !== 0) {
                        return (
                          <div key={`sc-value-${index}${indx}`} className="sc-row-content" style={{ width: scrollableColWidth ? scrollableColWidth / 6 : 150 }}>
                            <p>{dataObj[column.accessor]}</p>
                          </div>
                        )
                      }
                    })
                    }
                  </div>
                )
              })
            }
            {
              loading && (
                <div className="sc-row">
                  {columns.map((column, indx) => {
                    if (indx !== 0) {
                      return (
                        <div key={`sc-loading-${indx}`} className="sc-row-content" style={{ width: scrollableColWidth ? scrollableColWidth / 6 : 150 }}>
                          <p className="skeleton-root skeleton-text skeleton-pulse"></p>
                        </div>
                      )
                    }
                  })
                  }
                </div>
              )
            }
          </div>
        </div>
      </div >
    );
  }
};

ReactTable.propTypes = {
  data: PropTypes.array,
  isVirtualScroll: PropTypes.bool,
  rowsLimit: PropTypes.number,
  scrollableColWidth: PropTypes.number,
  height: PropTypes.number,
  fixedColWidth: PropTypes.number,
  columns: PropTypes.array
};

ReactTable.defaultProps = {
  data: [],
  isVirtualScroll: false,
  rowsLimit: 10,
  scrollableColWidth: 1000,
  height: 400,
  fixedColWidth: 180,
  columns: []
};

export default ReactTable;