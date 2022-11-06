/**
 * @jest-environment jsdom
 */

const {querySelctor} = require('./main')

describe('support id selector', () => {
  const username = document.createElement('span')
  username.id = "username";
  const btn = document.createElement('button')
  btn.id = "button";
  btn.classList.add('btn');
  btn.classList.add('btn-info');
  beforeEach(() => {
    // document.body.innerHTML = `<div><span id="username" /><button id="button" /></div>`;
    document.body.innerHTML = `<div></div>`;
    document.body.appendChild(username)
    document.body.appendChild(btn)
  });

  test('support universal selector', () => {
    const element = document.body.querySelector('*');
    expect(element).toBe(querySelctor('   *      ',document.body))
  });

  test('support id selector', () => {
    const element = document.querySelector('#username');
    expect(element).toBe(querySelctor('   #username   ',document.body))
  });

  test('support class selector', () => {
    const element = document.querySelector('.btn');
    expect(element).toBe(querySelctor('  .btn  ',document.body))
  });

  test('support tag selector', () => {
    const element = document.querySelector('span');
    expect(element).toBe(querySelctor('  span  ',document.body))
  });

});

describe.only('support pseudoCls  selector', () => {
  const username = document.createElement('span')
  username.id = "username";
  const btn = document.createElement('button')
  btn.id = "button";
  btn.classList.add('btn');
  btn.classList.add('btn-info');
  beforeEach(() => {
    // document.body.innerHTML = `<div><span id="username" /><button id="button" /></div>`;
    document.body.innerHTML = `<div></div>`;
    document.body.appendChild(username)
    document.body.appendChild(btn)
  });
  const pseudoCls = [
    ':active',
    ':any-link',
    ':autofill',
    ':blank',
    ':checked',
    ':current',
    ':default',
    ':defined',
    ':dir()',
    ':disabled',
    ':empty',
    ':enabled',
    ':first',
    ':first-child',
    ':first-of-type',
    ':fullscreen',
    ':future',
    ':focus',
    ':focus-visible',
    ':focus-within',
    ':has()',
    ':host',
    ':host()',
    ':host-context()',
    ':hover',
    ':indeterminate',
    ':in-range',
    ':invalid',
    ':is()',
    ':lang()',
    ':last-child',
    ':last-of-type',
    ':left',
    ':link',
    ':local-link',
    ':modal',
    ':not()',
    ':nth-child()',
    ':nth-col()',
    ':nth-last-child()',
    ':nth-last-col()',
    ':nth-last-of-type()',
    ':nth-of-type()',
    ':only-child',
    ':only-of-type',
    ':optional',
    ':out-of-range',
    ':past',
    ':picture-in-picture',
    ':placeholder-shown',
    ':paused',
    ':playing',
    ':read-only',
    ':read-write',
    ':required',
    ':right',
    ':root',
    ':scope',
    ':state()',
    ':target',
    ':target-within',
    ':user-invalid',
    ':valid',
    ':visited',
    ':where()'
  ];

  test.only('support pseudoCls selector', () => {
    pseudoCls.forEach(cls=>{
      console.log(cls,querySelctor(cls,document.body))
      expect(cls.replace(':','')).toBe(querySelctor(cls,document.body))
    })
  });

});
