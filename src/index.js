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
    const { rowsLimit, data, isVirtualScroll, columns } = this.props;
    let fixedColumns = [];
    let scrollableColumns = [];
    columns && columns.length > 0 && columns.map((column, index) => {
      if (column.position === 'left') {
        fixedColumns.push(column);
      } else if (column.position === 'right') {
        scrollableColumns.push(column);
      } else {
        scrollableColumns.push(column);
      }
    });
    this.setState({
      limit: rowsLimit,
      fixedColumns,
      scrollableColumns,
      rowData: isVirtualScroll ? data.slice(0, rowsLimit ? rowsLimit : 10) : data
    });
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
    const { loading, rowData, fixedColumns, scrollableColumns } = this.state;
    const { fixedColWidth, scrollableColWidth } = this.props;
    return (
      <div>
        <div className="fixed-column" style={{ width: fixedColWidth ? fixedColWidth + 32 : 150 }}>
          <div className="fc-heading">
            {fixedColumns && fixedColumns.length > 0 && fixedColumns.map((fixedCol, indx) => {
              return (
                <div key={`fixed-col-index${indx}`} className="fc-head" style={{ width: fixedColWidth ? fixedColWidth / fixedColumns.length : 150 }}>
                  <p>{fixedCol.header}</p>
                </div>
              )
            })}
          </div>
          <div className="fc-body" style={{ height: this.props.height ? this.props.height : 500 }}>
            {
              rowData && rowData.length > 0 && rowData.map((dataObj, index) => {
                return (
                  <div key={`fc-row-${index}`} className="fc-row">
                    {fixedColumns.map((fixedCol, indx) => {
                      return (
                        <div key={`fc-value-${index}${indx}`} className="fc-row-content" style={{ width: fixedColWidth ? fixedColWidth / fixedColumns.length : 150 }}>
                          <p>{dataObj[fixedCol.accessor]}</p>
                        </div>
                      )
                    })
                    }
                  </div>
                )
              })
            }
            {
              loading && (
                <div className="fc-row">
                  {fixedColumns.map((column, indx) => {
                    return (
                      <div key={`fc-loading-${indx}`} className="fc-row-content" style={{ width: fixedColWidth ? fixedColWidth / fixedColumns.length : 150 }}>
                        <p className="skeleton-root skeleton-text skeleton-pulse"></p>
                      </div>
                    )
                  })
                  }
                </div>
              )
            }
          </div>
        </div>
        <div className="scrollable-columns" style={{ marginLeft: fixedColWidth ? fixedColWidth + 32 : 182, width: scrollableColWidth ? scrollableColWidth : 800 }}>
          <div className="sc-heading">
            {scrollableColumns && scrollableColumns.length > 0 && scrollableColumns.map((column, index) => {
              return (
                <div key={`sc-head-value-${index}`} className="sc-head" style={{ width: scrollableColWidth ? scrollableColWidth / 6 : 150 }}>
                  <p>{column.header}</p>
                </div>
              )
            })
            }
          </div>
          <div className="sc-body" style={{ height: this.props.height ? this.props.height : 500 }}>
            {
              rowData && rowData.length > 0 && rowData.map((dataObj, index) => {
                return (
                  <div key={`sc-row-${index}`} className="sc-row">
                    {scrollableColumns.map((column, indx) => {
                      return (
                        <div key={`sc-value-${index}${indx}`} className="sc-row-content" style={{ width: scrollableColWidth ? scrollableColWidth / 6 : 150 }}>
                          <p>{dataObj[column.accessor]}</p>
                        </div>
                      )
                    })
                    }
                  </div>
                )
              })
            }
            {
              loading && (
                <div className="sc-row">
                  {scrollableColumns.map((column, indx) => {
                    return (
                      <div key={`sc-loading-${indx}`} className="sc-row-content" style={{ width: scrollableColWidth ? scrollableColWidth / 6 : 150 }}>
                        <p className="skeleton-root skeleton-text skeleton-pulse"></p>
                      </div>
                    )
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