
// import ReactGridLayout from 'react-grid-layout';
// require('react-grid-layout/css/styles.css');
// require('react-resizable/css/styles.css');
//  <ReactGridLayout className="layout" cols={2} rowHeight={200} width={1200}>
//   <div key="a" data-grid={{x: 0, y: 0, w: 1, h: 2}}></div>
//   <div key="b" data-grid={{x: 2, y: 0, w: 1, h: 2}}></div>
// </ReactGridLayout>

                  <div className="row terminal-grid">
                    <div className="col s6">
                      <div className="row">
                        <div className="col s12">
                          <Terminal/>
                         </div>
                       </div>
                      <div className="row">
                        <div className="col s12">
                          <TextEditor/>
                         </div>
                       </div>
                    </div>
                    <div className="col s6">
                      <OutputView />
                    </div>
                  </div>




              <p className="center-align">--text-editor--</p>