import React, { JSX } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type Contributor = {
    login: string;
    name: string;
    role: string;
    isProductOwner?: boolean;
};

const CONTRIBUTORS: Contributor[] = [
    { login: 'sunimalr', name: 'Dr. Sunimal Rathnayake', role: 'Product Owner', isProductOwner: true },
    { login: 'chandag', name :'Prof. Chandana Gamage', role: 'Product Owner', isProductOwner: true},
    { login: 'ashanuk', name: 'Anuradha Shanuka', role: 'Contributor' },
    { login: 'code-scanner-bot', name: 'Code Scanner Bot', role: 'Contributor' },
    { login: 'DaminduDeSilva', name: 'Damindu De Silva', role: 'Contributor' },
    { login: 'Judealanraj', name: 'Jude Alan', role: 'Contributor' },
    { login: 'kavienanj', name: 'Kavienan J', role: 'Contributor' },
    { login: 'kethakav', name: 'Kethaka Vidyananda', role: 'Contributor' },
    { login: 'MaathavanJkr', name: 'Maathavan', role: 'Contributor' },
    { login: 'moonlander101', name: 'Himath Samarakoon', role: 'Contributor' },
    { login: 'ragupari', name: 'Parishith Ragumar', role: 'Contributor' },
    { login: 'RevoVog', name: 'RevoVog', role: 'Contributor' },
    { login: 'RusiruSadathana', name: 'Rusiru Sadathana', role: 'Contributor' },
    { login: 'saai-syvendra', name: 'Saai Syvendra', role: 'Contributor' },
    { login: 'SahanWeerasiri', name: 'Sahan Lahiru', role: 'Contributor' },
    { login: 'seniru-dilmith', name: 'Seniru Dilmith', role: 'Contributor' },
    { login: 'suriyasg', name: 'Suriya Gnanamoorthy', role: 'Contributor' },
    { login: 'VarunRaj004', name: 'Varun Poobalaraja', role: 'Contributor' }
].sort((a, b) => {
    // Ensure Product Owner is always first
    if (a.isProductOwner) return -1;
    if (b.isProductOwner) return 1;
    // Then sort by name or login
    return (a.name || a.login).localeCompare(b.name || b.login);
});

export default function Contributors(): JSX.Element {
    const productOwners = CONTRIBUTORS.filter(c => c.isProductOwner);
    const contributors = CONTRIBUTORS.filter(c => !c.isProductOwner);

    return (
        <div className={styles.contributorsContainer}>
            {productOwners.length > 0 && (
                <ul className={clsx(styles.list, styles.productOwnerList)}>
                    {productOwners.map((contributor) => (
                        <li
                            key={contributor.login}
                            className={clsx(styles.contributor, styles.productOwner)}
                        >
                            <a
                                href={`https://github.com/${contributor.login}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.avatarLink}
                                title={`View ${contributor.name || contributor.login}'s GitHub profile`}
                            >
                                <img
                                    src={`https://github.com/${contributor.login}.png`}
                                    alt={contributor.name || contributor.login}
                                    className={styles.avatar}
                                />
                            </a>
                            <div className={styles.name}>{contributor.name || contributor.login}</div>
                            <div className={styles.role}>{contributor.role}</div>
                        </li>
                    ))}
                </ul>
            )}

            <ul className={styles.list}>
                {contributors.map((contributor) => (
                    <li
                        key={contributor.login}
                        className={styles.contributor}
                    >
                        <a
                            href={`https://github.com/${contributor.login}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.avatarLink}
                            title={`View ${contributor.name || contributor.login}'s GitHub profile`}
                        >
                            <img
                                src={`https://github.com/${contributor.login}.png`}
                                alt={contributor.name || contributor.login}
                                className={styles.avatar}
                            />
                        </a>
                        <div className={styles.name}>{contributor.name || contributor.login}</div>
                        <div className={styles.role}>{contributor.role}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
