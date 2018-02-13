jQuery( document ).ready( function( $ ) {
        var elem = document.createElement( 'input' );

        // elem.setAttribute( 'type', 'date' );
        // if ( 'text' === elem.type ) {
                        $( '#mf2_start_date' ).datepicker({
                                dateFormat: 'yy-mm-dd'
                        });
                        $( '#mf2_end_date' ).datepicker({
                                dateFormat: 'yy-mm-dd'
                        });
                        $( '#cite_published_date' ).datepicker({
                                dateFormat: 'yy-mm-dd'
                        });
                        $( '#cite_updated_date' ).datepicker({
                                dateFormat: 'yy-mm-dd'
                        });

          //      }
          //      elem.setAttribute( 'type', 'time' );
            //    if ( 'text' === elem.type ) {
                                $( '#mf2_start_time' ).timepicker({
                                        timeFormat: 'H:i:s',
                                        step: 15
                                });
                                $( '#mf2_end_time' ).timepicker({
                                        timeFormat: 'H:i:s',
                                        step: 15
                                });
                                $( '#cite_published_time' ).timepicker({
                                        timeFormat: 'H:i:s',
                                        step: 15
                                });
                                $( '#cite_updated_time' ).timepicker({
                                        timeFormat: 'H:i:s',
                                        step: 15
                                });

            //    }
	$( '#duration' ).datepair();
	changeSettings();


function clearPostProperties() {
	var fieldIds = [
		'cite_url',
		'cite_name',
		'cite_summary',
		'cite_tags',
		'cite_author_name',
		'cite_author_url',
		'cite_author_photo',
		'cite_featured',
		'cite_publication',
		'mf2_rsvp'
	];
		if ( ! confirm( 'Are you sure you want to clear post propertie?' ) ) {
			return;
		}
		$.each( fieldIds, function( count, val ) {
			document.getElementById( val ).value = '';
		});
}

function addhttp( url ) {
	if ( ! /^(?:f|ht)tps?\:\/\//.test( url ) ) {
		url = 'http://' + url;
	}
	return url;
}

function showLoadingSpinner() {
	$( '#replybox-meta' ).addClass( 'is-loading' );
}

function hideLoadingSpinner() {
	$( '#replybox-meta' ).removeClass( 'is-loading' );
}

//function used to validate website URL
function checkUrl( url ) {

    //regular expression for URL
    var pattern = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;

    if ( pattern.test( url ) ) {
        return true;
    } else {
        return false;
    }
}

function getLinkPreview() {
	if ( '' === $( '#cite_url' ).val() ) {
		return;
	}
	$.ajax({
		type: 'GET',

		// Here we supply the endpoint url, as opposed to the action in the data object with the admin-ajax method
		url: PKAPI.api_url + 'parse/',
		beforeSend: function( xhr ) {

		// Here we set a header 'X-WP-Nonce' with the nonce as opposed to the nonce in the data object with admin-ajax
		xhr.setRequestHeader( 'X-WP-Nonce', PKAPI.api_nonce );
		},
		data: {
			kindurl: $( '#cite_url' ).val()
		},
		success: function( response ) {
			var published;
			var updated;
			if ( 'undefined' === typeof response ) {
				alert( 'Error: Unable to Retrieve' );
				return;
			}
			if ( 'message' in response ) {
				alert( response.message );
				return;
			}
			if ( 'name' in response ) {
				$( '#cite_name' ).val( response.name );
				if ( '' === $( '#title' ).val() ) {
					$( '#title' ).val( response.name );
				}
			}
			if ( 'publication' in response ) {
				$( '#cite_publication' ).val( response.publication ) ;
			}
			if ( 'published' in response ) {
				published = moment.parseZone( response.published );
				$( '#cite_published_date' ).val( published.format( 'YYYY-MM-DD' ) ) ;
				$( '#cite_published_time' ).val( published.format( 'HH:mm:ss' ) ) ;
				$( '#cite_published_offset' ).val( published.format( 'Z' ) );
			}
			if ( 'updated' in response ) {
				updated = moment.parseZone( response.updated );
				$( '#cite_updated_date' ).val( updated.format( 'YYYY-MM-DD' ) ) ;
				$( '#cite_updated_time' ).val( updated.format( 'HH:mm:ss' ) ) ;
				$( '#cite_updated_offset' ).val( updated.format( 'Z' ) );
			}
			if ( 'summary' in response ) {
				$( '#cite_summary' ).val( response.summary ) ;
			}
			if ( 'featured' in response ) {
				$( '#cite_featured' ).val( response.featured ) ;
			}
			if ( ( 'author' in response ) && ( 'string' != typeof response.author ) ) {
				if ( 'name' in response.author ) {
					if ( 'string' === typeof response.author.name ) {
						$( '#cite_author_name' ).val( response.author.name );
					} else {
						$( '#cite_author_name' ).val( response.author.name.join( ';' ) ) ;
					}
				}
				if ( 'photo' in response.author ) {
					if ( 'string' === typeof response.author.name ) {
						$( '#cite_author_photo' ).val( response.author.photo );
					} else {
						$( '#cite_author_photo' ).val( response.author.photo.join( ';' ) ) ;
					}
				}
				if ( 'url' in response.author ) {
					if ( 'string' === typeof response.author.url ) {
						$( '#cite_author_url' ).val( response.author.url );
					} else {
						$( '#cite_author_url' ).val( response.author.url.join( ';' ) ) ;
					}
				}
			}
			if ( 'category' in response ) {
				$( '#cite_tags' ).val( response.category.join( ';' ) );
			}
		alert( PKAPI.success_message );
		console.log( response );
		},
		fail: function( response ) {
			console.log( response );
			alert( response.message );
		},
		error: function( jqXHR, textStatus, errorThrown ) {
			alert( textStatus );
			console.log( jqXHR );
		},
		always: hideLoadingSpinner()
	});
}

function changeSettings() {
	kind = $( 'input[name=\'tax_input[kind]\']:checked' ).val();
	switch ( kind ) {
		case 'note':
			hideTitle();
			hideReply();
			hideRSVP();
			break;
		case 'article':
			showTitle();
			hideReply();
			hideRSVP();
			break;
		case 'issue':
			showTitle();
			showReply();
			hideRSVP();
			break;
		case 'rsvp':
			showReply();
			hideTitle();
			showRSVP();
			break;
		default:
			showReply();
			hideTitle();
			hideRSVP();
	}
}

function showReply() {
	$( '#replybox-meta' ).removeClass( 'hidden' );
}

function hideReply() {
	$( '#replybox-meta' ).addClass( 'hidden' );
}

function showTitle() {
	$( '#titlediv' ).removeClass( 'hidden' );
}

function hideTitle() {
	$( '#titlediv' ).addClass( 'hidden' );
}

function showRSVP() {
	$( '#rsvp-option' ).removeClass( 'hide-if-js' );
}

function hideRSVP() {
	$( '#rsvp-option' ).addClass( 'hide-if-js' );
}


jQuery( document )
	.on( 'change', '#taxonomy-kind', function( event ) {
		changeSettings();
		event.preventDefault();
	})
	.on( 'change', '#cite_url', function( event ) {
		if ( false == checkUrl( $( '#cite_url' ).val() ) ) {
			alert( 'Invalid URL' );
		} else if ( '' === $( '#cite_name' ).val() ) {
			showLoadingSpinner();
			getLinkPreview();
		}
		event.preventDefault();
	})
	.on( 'click', '.clear-kindmeta-button', function( event ) {
		clearPostProperties();
		event.preventDefault();
	})
	.on( 'click', 'a.show-kind-details', function( event ) {
		if ( $( '#kind-details' ).is( ':hidden' ) ) {
			$( '#kind-details' ).slideDown( 'fast' ).siblings( 'a.hide-kind-details' ).show().focus();
		} else {
			$( '#kind-details' ).slideUp( 'fast' ).siblings( 'a.show-kind-details' ).focus();
		}
		event.preventDefault();
	})
	.on( 'click', 'a.show-kind-author-details', function( event ) {
		if ( $( '#kind-author' ).is( ':hidden' ) ) {
			$( '#kind-author' ).slideDown( 'fast' ).siblings( 'a.hide-kind-author' ).show().focus();
		} else {
			$( '#kind-author' ).slideUp( 'fast' ).siblings( 'a.show-kind-author' ).focus();
		}
		event.preventDefault();
	});

});
