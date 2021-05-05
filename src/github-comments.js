(function () {
'use strict';

class GitHubComments {
	constructor() {
		this.script = document.currentScript;
		this.issue = this.script.dataset.ghissue;
		this.target_el = document.querySelector( this.script.dataset.target );

		this.issue_url = `https://github.com/${this.script.dataset.ghissue}`;
		this.comments_url = `https://api.github.com/repos/${this.script.dataset.ghissue}/comments`;
	}

	/* *** */

	add_comments() {
		let xhr = new XMLHttpRequest();
		let me = this;

		xhr.onload = function () {
			if ( xhr.status !== 200 ) {
				xhr.onerror();
			}

			me.inject( xhr.response );
		}

		xhr.onerror = function() {
			let error_el = document.createElement( "p" );
			error_el.innerHTML = "<strong>Failed to load comments</strong>\n";
			me.target_el.appendChild( error_el );
		}

		xhr.responseType = "json";
		xhr.open( "GET", this.comments_url );
		xhr.setRequestHeader( "Accept", "application/vnd.github.v3.html+json" );
		xhr.send();
	}

	inject( comments ) {
		let h3 = document.createElement( "h3" );
		h3.innerText = "Comments: " + comments.length;
		this.target_el.appendChild( h3 );

		for ( const [ i, comment ] of Object.entries( comments ) ) {
			let div = document.createElement( "div" );
			div.className = "github-comments-container";

			let comment_date = new Date( comment.created_at );

			div.innerHTML = `
				<div class="github-comment">
					<img src="${comment.user.avatar_url}" />
					<span>
						<a class="github-comment-author" href="${comment.user.html_url}">${comment.user.login}</a>
						<br />
						<span class="github-comment-date">${comment_date}</span>
					</span>
					<div class="github-comment-content">
						${comment.body_html}
					</div>
				</div>
			`;

			this.target_el.appendChild( div );
		}
	}
}

let _ghc = new GitHubComments();
_ghc.add_comments();

})();
