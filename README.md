AngularJS Example Code
===

#AngularJS example code written by Deane Turner

Tue Oct 29 13:23:48 EDT 2013

#Log in

<a href="http://somedomain.com/cc/ClientLogin" target="_blank">http://somedomain.com/cc/ClientLogin</a>

# Installation and Setup

## Client Application

#### Prerequisites<a name="prereq">
The client application is built using a combination technologies: Node.js, Git, Ruby, SASS/Compass, Yeoman, Grunt, and Bower.

Node.js is prerequisite and provides the foundation for running the build.

 - Dowload and install Node.js.  Node.js can be found at <a href="http://nodejs.org/" target="_blank">http://nodejs.org/</a>

Git is required for pulling down source via Node.js and Grunt.

 - Download and install Git.  Git can be found at <a href="http://git-scm.com/" target="_blank">http://git-scm.com/</a>

SASS is a style sheet technology which uses Ruby/Compass to compile style sheets.

 - Download and install Ruby.  Ruby can be found at <a href="https://www.ruby-lang.org/en/" target="_blank">https://www.ruby-lang.org/en/</a>

 - Install Compass (from console/terminal)

    > gem install compass

Yeoman is a workflow tool.
Yo scaffolds out a new application, writes your Grunt configuration, and pulls in relevant Grunt tasks that are needed for the build.
Grunt is used to build, preview and test your project.
Bower is used for dependency management.

 - Install Yeoman, Grunt, and Bower

    > npm install -g yo

 - (Optional) Install the AngularJS generator for use in future projects

    > npm install -g generator-angular

## Build

 - Check out this project into your workspace.

 - Using Command Prompt or Terminal, navigate to the project's root directory.

 **It is important to run bower, grunt, and npm relative to their respective configuration files (e.g. bower.json, Gruntfile.js, package.json)!**

 - Install project external JavaScript dependencies using Bower.  Bower reads the bower.json in it's current context path to determine which dependencies are required.

    > bower install

 - Install Node.js dependencies using the Node package manager.  NPM reads the package.json file to determine which packages are required.

    > npm install

 - (Continue with either the development workflow or production distribution routes below.)

### Development Workflow

 - Compile Sass into CSS and generate necessary files.  This will load the resultant main.css file in the styles directory.

    > grunt compass:dev

    Note: compass:dev will need to be run after modifying SASS or CSS files, as well as running the production build.


 - Start the grunt server for Tomcat.  (Alternatively, start the watch task to monitor changes e.g. grunt watch)

    > grunt serve

    The grunt server allows dynamic changes to occur without refreshing the browser - using a Tomcat server (html, js, sass)


 - Monitor the server or watch task, as it is important for the following reasons:

    > JSHint compliance - Code consistency and accuracy is a prerequisite for the production build (the build will not proceed successfully
 without a successful JSHint task).  Also, it supports code consistency and good level of language compliance.  The watch task will run JSHint for
 each JavaScript file change.

    > Dynamic Compass / SASS compilation - The watch task will recompile and load the main.css file when relevant files change.

    > Test Execution - The watch task will run unit tests when relevant files change.


 - Periodically run the production build to assure that code minification is working properly.

    > AngularJS is susceptible to breaking when minified
  (see relevant material on AngularJS minification).  Verification requires the opening of the distribution's index.html file in a browser and
  inspecting the console for JavaScript load errors.

    > See Production Distribution below.

### Production Distribution

Building the production distribution involves minifying the JavaScript and CSS resources into single versioned files.  This optimizes the
download sizes for JavaScript files and consolidates CSS resources (including images) for production.  Versioning is most important to avoid
client-side caching of the application.

**It is important to run bower, grunt, and npm relative to their respective configuration files (e.g. bower.json, Gruntfile.js, package.json)!**

 - Build the minified version of the application into a distribution directory (look for the 'dist' directory at the root level of the project).

    > grunt

    Note: Running the production build will delete the main.ccs file under styles.


## Server-side Application

### Installation

#### Prerequisites

See the UI [Prerequisites](#prereq) section above.

Jakarta Ant <a href="http://ant.apache.org/bindownload.cgi" target="_blank">http://ant.apache.org/bindownload.cgi</a>

JDK 1.7 <a href="http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html" target="_blank">http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html</a>


#### Tomcat Deployment

##### UI Development

This configuration uses NON-MINIFIED web content during development.

 - Deploy using the context "ccii".  Ensure your Tomcat deployment has a reference to the environment configuration below.

 (../conf/Catalina/localhost/ccii.xml)

*Change docBase and Environment values accordingly.*

    <Context
            docBase="/Users/dev1/Desktop/Projects/cc/app"
            crossContext="false"
            privileged="false"
            allowLinking="false"
            reloadable="true">

      <Environment
        name="accounts-file-path"
        type="java.lang.String"
        value="/Users/dev1/Desktop/Projects/cc/accounts.json" />

    </Context>

 - Build the complete application

    > ant ui-dev

##### Java Development

This configuration uses MINIFIED web contend during development.

- Deploy using the context "ccii".  Ensure your Tomcat deployment has a reference to the environment configuration below.

 (../conf/Catalina/localhost/ccii.xml)

*Change docBase, extraResourcePaths, virtualClassPath, and Environment values accordingly.*

    <Context
        docBase="/Users/dev1/Desktop/Projects/cc/build/WebContent"
        crossContext="false"
        privileged="false"
        allowLinking="false"
        reloadable="true">

    <Resources className="org.apache.naming.resources.VirtualDirContext"
               extraResourcePaths="/WEB-INF/classes=/Users/dev1/Desktop/Projects/cc/app/WEB-INF/classes"
            />
    <Loader className="org.apache.catalina.loader.VirtualWebappLoader"
            virtualClasspath="/Users/dev1/Desktop/Projects/cc/app/WEB-INF/classes;/Users/dev1/Desktop/Projects/cc/app/WEB-INF/lib/log4j-1.2.17.jar;/Users/dev1/Desktop/Projects/cc/app/WEB-INF/app.properties;/Users/dev1/Desktop/Projects/cc/app/WEB-INF/hrp-commands.properties"
            />
    <JarScanner scanAllDirectories="true" />

    <Environment
            name="accounts-file-path"
            type="java.lang.String"
            value="/Users/dev1/Desktop/Projects/cc/accounts.json" />

    </Context>

 - Build the complete application

    > ant java-dev

##### Production WAR

 - Build the production WAR file.

    > ant war


## Documentation - API and Tutorials

To generate the API documenation and tutorials into a local docs directory.

    > grunt ngdoc

## How To: Reuse this Project Structure

This application structure was built using Yeoman (<a href="http://yeoman.io/" target="_blank">http://yeoman.io/</a>).

 - Install the prerequisites as outlined in [Prerequisites](#prereq) section above.

 - Install Yeoman.

    > npm install -g yo

 - Change to the workspace directory for your project.

    > cd .../workspace

**It is important to run yo within the root of the project directory you intend the application to scaffold in!**

- Scaffold the application.

    > yo angular

 - Add any dependencies to the bower.json file and run bower install.

    >  {
      ...
      "dependencies": {
        ...
        "highcharts.com": "~3.0.7",
        "font-awesome": "~4.0.1",
        "momentjs": "~2.4.0",
        "bootstrap-datepicker": "1.2.0"
      },

    > bower install

 - Add compass task compass:dev to enable the development workflow.  This task will use Compass to compile SASS into the main.css file, and copy
   it into the styles directory.

    > dev: {
                      options: {
                          generatedImagesDir: '<%= yeoman.dist %>/images/generated',
                          cssDir: '<%= yeoman.app %>/styles'
                      }
                  },

 - Modify the clean:dist task to remove the main.css file generated by compass:dev.

    > clean: {
                  dist: {
                      files: [
                          {
                              ...
                              src: [
                                  ...
                                  '<%= yeoman.app %>/styles/*.css'
                              ]
                          }
                      ]
                  },

 - Disable the livereload server connect task.

    >         grunt.task.run([
                  ....
                  //'connect:livereload',
                  ...
              ]);

 - Insert the livereload script for use by Tomcat into index.html.

    > See this project's index.html header.

 - Remove the Google Analytics section in index.html.

 - Add any CSS styles that support SASS using Bower.  Modify styles/main.scss to import the SASS library and define any required variables.

 - And any non-SASS CSS style sheets to index.html. Ensure the tag is enclose in the build tag set.

    > <!-- build:css({.tmp,app}) styles/main.css -->
          <link rel="stylesheet" href="styles/main.css">
          <link rel="stylesheet" type="text/css" media="all" href="bower_components/bootstrap-datepicker/css/datepicker.css"/>
          <!-- endbuild -->

 - Add these items to .gitignore

    > app/styles/main.css



 Data Base Schema
   https://docs.google.com/a/somedomain.com/spreadsheet/ccc?key=0AnYC49KOONJRdEZucU1fZ3dxYzZhc3NFRkZfc1l0bWc#gid=0

