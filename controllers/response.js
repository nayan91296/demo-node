
module.exports.success = function(data) {
    return {
      success: true,
      data: data
    };
  };
  
  module.exports.error = function(error) {
    return {
      success: false,
      error: error
    };
  };
  
  module.exports.validationError = function(errors) {
    return {
      success: false,
      errors: errors
    };
  };