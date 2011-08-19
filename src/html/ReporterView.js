jasmine.HtmlReporter.ReporterView = function(specs, specFilter, dom, views) {
  this.startedAt = new Date();
  this.runningSpecCount = 0;
  this.completeSpecCount = 0;
  this.passedCount = 0;
  this.failedCount = 0;
  this.skippedCount = 0;

  this.createResultsMenu = function() {
    this.resultsMenu = this.createDom('span', {className: 'resultsMenu bar'},
        this.summaryMenuItem = this.createDom('a', {className: 'summaryMenuItem', href: "#"}, '0 specs'),
        ' | ',
        this.detailsMenuItem = this.createDom('a', {className: 'detailsMenuItem', href: "#"}, '0 failing'));

    this.summaryMenuItem.onclick = function() {
      dom.reporter.className = dom.reporter.className.replace(/ showDetails/g, '');
    };

    this.detailsMenuItem.onclick = function() {
      showDetails();
    };
  };

  this.specComplete = function(specView) {
    this.completeSpecCount++;

    switch (specView.status()) {
      case 'passed':
        this.passedCount++;
        break;

      case 'failed':
        this.failedCount++;
        break;

      case 'skipped':
        this.skippedCount++;
        break;
    }

    this.refresh();
  };

  this.refresh = function() {

    if (isUndefined(this.resultsMenu)) {
      this.createResultsMenu();
    }

    // currently running UI
    if (isUndefined(this.runningAlert)) {
      this.runningAlert = this.createDom('a', {href: "?", className: "runningAlert bar"});
      dom.alert.appendChild(this.runningAlert);
    }
    this.runningAlert.innerHTML = "Running " + this.completeSpecCount + " of " + this.totalSpecCount + " spec" + (this.totalSpecCount == 1 ? "" : "s" );

    // skipped specs UI
    if (isUndefined(this.skippedAlert)) {
      this.skippedAlert = this.createDom('a', {href: "?", className: "skippedAlert bar"});
    }

    this.skippedAlert.innerHTML = "Skipping " + this.skippedCount + " of " + this.totalSpecCount + " spec" + (this.totalSpecCount == 1 ? "" : "s" ) + " - run all";

    if (this.skippedCount === 1 && isDefined(dom.alert)) {
      dom.alert.appendChild(this.skippedAlert);
    }

    // passing specs UI
    if (isUndefined(this.passedAlert)) {
      this.passedAlert = this.createDom('span', {href: "?", className: "passingAlert bar"});
    }
    this.passedAlert.innerHTML = "Passing " + this.passedCount + " spec" + (this.passedCount == 1 ? "" : "s" );

    // failing specs UI
    if (isUndefined(this.failedAlert)) {
      this.failedAlert = this.createDom('span', {href: "?", className: "failingAlert bar"});
    }
    this.failedAlert.innerHTML = "Failing " + this.failedCount + " spec" + (this.totalSpecCount == 1 ? "" : "s" );

    if (this.failedCount === 1 && isDefined(dom.alert)) {
      dom.alert.appendChild(this.failedAlert);
      dom.alert.appendChild(this.resultsMenu);
    }

    // summary info
    this.summaryMenuItem.innerHTML = "" + this.runningSpecCount + " spec" + (this.runningSpecCount == 1 ? "" : "s" );
    this.detailsMenuItem.innerHTML = "" + this.failedCount + " failing";
  };

  this.complete = function() {
    dom.alert.removeChild(this.runningAlert);

    this.skippedAlert.innerHTML = "Ran " + this.runningSpecCount + " of " + this.totalSpecCount + " spec" + (this.totalSpecCount == 1 ? "" : "s" ) + " - run all";

    // if all specs are passing, show passing alert else show failing details
    if (this.failedCount === 0) {
      dom.alert.appendChild(this.createDom('span', {className: 'passingAlert bar'}, "Passing " + this.passedCount + " spec" + (this.passedCount == 1 ? "" : "s" )));
    } else {
      showDetails();
    }

    dom.banner.appendChild(this.createDom('span', {className: 'duration'}, "finished in " + ((new Date().getTime() - this.startedAt.getTime()) / 1000) + "s"));
  };

  for (var i = 0; i < specs.length; i++) {
    var currentSpec = specs[i];
    views.specs[currentSpec.id] = new jasmine.HtmlReporter.SpecView(currentSpec, dom, views);
    if (specFilter(currentSpec)) {
      this.runningSpecCount++;
    }
  }

  this.totalSpecCount = specs.length;

  return this;

  function showDetails() {
    if (dom.reporter.className.search(/showDetails/) === -1) {
      dom.reporter.className += " showDetails";
    }
  }

  function isUndefined(obj) {
    return typeof obj === 'undefined';
  }

  function isDefined(obj) {
    return !isUndefined(obj);
  }
};

jasmine.HtmlReporterHelpers.addHelpers(jasmine.HtmlReporter.ReporterView);


