/**
 * Rubric Content Type
 */

 var H5P = H5P || {};

 /**
  * Music Composition Exercises module
  * @param  {H5P.jQuery} $ jQuery usef by H5P Core
  * @return {function}   Rubric constructor
  */
 H5P.Rubric = (function($) {
   /**
    * Rubric constructor
    * @param       {object} options Object with current data and configurations
    * @param       {integer} id      Unique identifier
    * @constructor
    */
   function Rubric (options, id) {
     this.options = options;
     this.id = id;
   }

   /**
    * Returns title
    * @return {string} Title text
    */
   Rubric.prototype.getTitle = function() {
     return this.options.title;
   };

   /**
    * Returns description
    * @return {string} Description text
    */
   Rubric.prototype.getDescription = function() {
     return this.options.description;
   };

   /**
    * Checks if description is set and not empty
    * @return {boolean} Description is set or not
    */
   Rubric.prototype.hasDescription = function() {
     var description = this.getDescription() || '';
     description = description.trim();

     return description && description.length > 0;
   };

   /**
    * Creates and fills container with content
    * @param  {object} $container Container node
    * @return {void}
    */
   Rubric.prototype.attach = function($container) {
     var self = this;
     self.$container = $container;

     $container.addClass('h5p-rubric');
     $('<h3>', {
       'class': 'h5p-rubric-title',
       'text': self.getTitle()
     }).appendTo($container);

     if (self.hasDescription()) {
       $('<div>', {
         'class': 'h5p-rubric-description',
         'html': self.getDescription()
       }).appendTo($container);
     }
   };

   return Rubric;
 })(H5P.jQuery);
